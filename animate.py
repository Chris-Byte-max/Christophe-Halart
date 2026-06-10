#!/usr/bin/env python3
"""
animate.py — Pipeline d'animation Runway (Gen-4.5) pour « ANN: The Movie ».

Lit clips.json, anime chaque photo active via l'API Runway (image_to_video),
télécharge le .mp4 dans output/, et consigne le résultat + le seed dans
output/production_log.json pour garantir la reproductibilité.

Usage :
    python animate.py                 # tous les clips "active": true
    python animate.py --all           # tous les clips, peu importe "active"
    python animate.py --only NAME     # un seul clip par son "name"
    python animate.py --config FILE   # autre fichier que clips.json
    python animate.py --dry-run       # n'appelle pas l'API, montre le plan
"""

from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import random
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

# --- Constantes -------------------------------------------------------------

ROOT = Path(__file__).resolve().parent
PHOTOS_DIR = ROOT / "photos"
OUTPUT_DIR = ROOT / "output"
LOG_FILE = OUTPUT_DIR / "production_log.json"
DEFAULT_CONFIG = ROOT / "clips.json"

# Statuts renvoyés par l'API Runway pour une tâche.
DONE_OK = "SUCCEEDED"
DONE_BAD = {"FAILED", "CANCELLED"}

# Bornes de polling.
POLL_INTERVAL_S = 5
POLL_TIMEOUT_S = 15 * 60  # 15 min : large pour un clip de quelques secondes.

# Ratios supportés par Gen-4.5 (pour un message d'erreur utile).
VALID_RATIOS = {
    "1280:720", "1584:672", "1104:832",   # paysage
    "720:1280", "832:1104", "672:1584",   # portrait
    "960:960",                            # carré
}


# --- Petits utilitaires d'affichage ----------------------------------------

def info(msg: str) -> None:
    print(msg, flush=True)


def warn(msg: str) -> None:
    print(f"⚠️  {msg}", flush=True)


def fail(msg: str) -> None:
    print(f"❌ {msg}", file=sys.stderr, flush=True)


# --- Chargement de la configuration ----------------------------------------

def load_config(path: Path) -> tuple[dict, list[dict]]:
    if not path.exists():
        fail(f"Fichier de config introuvable : {path}")
        sys.exit(1)
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"clips.json est invalide (JSON) : {exc}")
        sys.exit(1)

    defaults = data.get("defaults", {})
    clips = data.get("clips", [])
    if not isinstance(clips, list) or not clips:
        fail("clips.json ne contient aucun clip dans \"clips\".")
        sys.exit(1)
    return defaults, clips


def resolve_clip(clip: dict, defaults: dict) -> dict:
    """Fusionne les valeurs par défaut avec les surcharges du clip."""
    merged = {**defaults, **clip}
    return merged


def select_clips(clips: list[dict], defaults: dict, args) -> list[dict]:
    resolved = [resolve_clip(c, defaults) for c in clips]

    if args.only:
        chosen = [c for c in resolved if c.get("name") == args.only]
        if not chosen:
            fail(f"Aucun clip nommé « {args.only} » dans la config.")
            sys.exit(1)
        return chosen

    if args.all:
        return resolved

    return [c for c in resolved if c.get("active") is True]


# --- Encodage de la photo en data URI --------------------------------------

def resolve_photo(image_name: str) -> Path:
    """Retrouve la photo dans photos/ de façon tolérante : d'abord le chemin
    exact, sinon une correspondance par nom sans tenir compte de la casse ni
    de l'extension (.jpg/.jpeg/.png/...)."""
    exact = PHOTOS_DIR / image_name
    if exact.exists():
        return exact
    stem = Path(image_name).stem.lower()
    if PHOTOS_DIR.exists():
        for f in sorted(PHOTOS_DIR.iterdir()):
            if f.is_file() and f.stem.lower() == stem:
                return f
    raise FileNotFoundError(
        f"Photo introuvable pour « {image_name} » dans photos/ "
        f"(dépose-la, ou corrige le champ \"image\")."
    )


def image_to_data_uri(image_name: str) -> str:
    path = resolve_photo(image_name)
    mime, _ = mimetypes.guess_type(str(path))
    if mime is None:
        mime = "image/jpeg"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


# --- Validation d'un clip ---------------------------------------------------

def validate_clip(clip: dict) -> list[str]:
    errors: list[str] = []
    if not clip.get("name"):
        errors.append("champ \"name\" manquant")
    if not clip.get("image"):
        errors.append("champ \"image\" manquant")
    if not clip.get("prompt"):
        errors.append("champ \"prompt\" manquant")

    ratio = clip.get("ratio")
    if ratio and ratio not in VALID_RATIOS:
        errors.append(
            f"ratio « {ratio} » non supporté (valides : {', '.join(sorted(VALID_RATIOS))})"
        )

    duration = clip.get("duration")
    if duration is not None and not (2 <= int(duration) <= 10):
        errors.append("duration doit être entre 2 et 10 secondes")
    return errors


# --- Journal de production --------------------------------------------------

def append_log(entry: dict) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    log: list = []
    if LOG_FILE.exists():
        try:
            log = json.loads(LOG_FILE.read_text(encoding="utf-8"))
            if not isinstance(log, list):
                log = []
        except json.JSONDecodeError:
            warn("production_log.json illisible — on repart d'un journal vide.")
            log = []
    log.append(entry)
    LOG_FILE.write_text(json.dumps(log, indent=2, ensure_ascii=False), encoding="utf-8")


# --- Génération d'un clip ---------------------------------------------------

def generate_clip(client, clip: dict, dry_run: bool) -> bool:
    name = clip["name"]
    model = clip.get("model", "gen4.5")
    ratio = clip.get("ratio", "1280:720")
    duration = int(clip.get("duration", 5))
    prompt = clip["prompt"]

    # Seed : on le fixe côté client s'il n'est pas fourni, pour pouvoir
    # reproduire exactement le clip plus tard (consigné dans le journal).
    seed = clip.get("seed")
    if seed is None:
        seed = random.randint(0, 2**32 - 1)

    info(f"\n🎬 {name}")
    info(f"   modèle={model}  ratio={ratio}  durée={duration}s  seed={seed}")
    info(f"   prompt: {prompt}")

    if dry_run:
        try:
            found = resolve_photo(clip["image"])
            info(f"   photo OK : {found.name}")
        except FileNotFoundError:
            warn(f"   photo absente : {clip['image']} (à déposer dans photos/)")
        info("   (dry-run : aucun appel API)")
        return True

    started = datetime.now(timezone.utc)
    try:
        prompt_image = image_to_data_uri(clip["image"])
    except FileNotFoundError as exc:
        fail(str(exc))
        return False

    try:
        task = client.image_to_video.create(
            model=model,
            prompt_image=prompt_image,
            prompt_text=prompt,
            ratio=ratio,
            duration=duration,
            seed=seed,
        )
    except Exception as exc:  # noqa: BLE001 — on veut continuer aux autres clips
        fail(f"Échec de la création de la tâche : {exc}")
        return False

    task_id = task.id
    info(f"   tâche créée : {task_id} — génération en cours…")

    output_urls = poll_task(client, task_id)
    if output_urls is None:
        append_log({
            "timestamp": started.isoformat(),
            "name": name,
            "model": model,
            "ratio": ratio,
            "duration": duration,
            "seed": seed,
            "prompt": prompt,
            "task_id": task_id,
            "status": "FAILED",
            "output_file": None,
            "output_url": None,
        })
        return False

    out_path = OUTPUT_DIR / f"{name}.mp4"
    ok = download(output_urls[0], out_path)

    append_log({
        "timestamp": started.isoformat(),
        "name": name,
        "model": model,
        "ratio": ratio,
        "duration": duration,
        "seed": seed,
        "prompt": prompt,
        "task_id": task_id,
        "status": DONE_OK if ok else "DOWNLOAD_FAILED",
        "output_file": str(out_path.relative_to(ROOT)) if ok else None,
        "output_url": output_urls[0],
    })

    if ok:
        info(f"   ✅ {out_path.relative_to(ROOT)}")
    return ok


def poll_task(client, task_id: str):
    """Poll jusqu'à complétion. Retourne la liste d'URLs ou None si échec."""
    deadline = time.time() + POLL_TIMEOUT_S
    last_progress = -1
    while time.time() < deadline:
        time.sleep(POLL_INTERVAL_S)
        try:
            task = client.tasks.retrieve(task_id)
        except Exception as exc:  # noqa: BLE001
            warn(f"   poll : erreur réseau ({exc}) — nouvelle tentative")
            continue

        status = task.status
        if status == DONE_OK:
            output = getattr(task, "output", None)
            if not output:
                fail("   tâche réussie mais sans sortie ?!")
                return None
            return list(output)

        if status in DONE_BAD:
            reason = getattr(task, "failure", None) or status
            code = getattr(task, "failure_code", None)
            fail(f"   échec de la tâche : {reason}" + (f" [{code}]" if code else ""))
            return None

        progress = getattr(task, "progress", None)
        if progress is not None:
            pct = int(progress * 100)
            if pct != last_progress:
                info(f"   … {status} {pct}%")
                last_progress = pct
        else:
            info(f"   … {status}")

    fail(f"   délai dépassé ({POLL_TIMEOUT_S}s) — tâche {task_id} abandonnée.")
    return None


def download(url: str, dest: Path) -> bool:
    import requests

    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        with requests.get(url, stream=True, timeout=60) as resp:
            resp.raise_for_status()
            with open(dest, "wb") as fh:
                for chunk in resp.iter_content(chunk_size=1 << 16):
                    fh.write(chunk)
    except Exception as exc:  # noqa: BLE001
        fail(f"   téléchargement échoué : {exc}")
        return False
    return True


# --- Point d'entrée ---------------------------------------------------------

def build_client():
    """Construit le client Runway après chargement du .env."""
    try:
        from dotenv import load_dotenv
    except ImportError:
        fail("python-dotenv n'est pas installé. Lance : pip install -r requirements.txt")
        sys.exit(1)
    load_dotenv(ROOT / ".env")

    import os
    if not os.environ.get("RUNWAYML_API_SECRET"):
        fail("RUNWAYML_API_SECRET absent. Copie .env.example en .env et colle ta clé.")
        sys.exit(1)

    try:
        from runwayml import RunwayML
    except ImportError:
        fail("Le SDK runwayml n'est pas installé. Lance : pip install -r requirements.txt")
        sys.exit(1)

    return RunwayML()


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description="Pipeline d'animation Runway pour ANN: The Movie")
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG, help="fichier de config (défaut: clips.json)")
    parser.add_argument("--all", action="store_true", help="traiter tous les clips (ignore \"active\")")
    parser.add_argument("--only", metavar="NAME", help="traiter un seul clip par son \"name\"")
    parser.add_argument("--dry-run", action="store_true", help="ne pas appeler l'API, montrer le plan")
    return parser.parse_args(argv)


def main(argv=None) -> int:
    args = parse_args(argv)
    defaults, clips = load_config(args.config)
    selected = select_clips(clips, defaults, args)

    if not selected:
        warn("Aucun clip à traiter. Passe un clip à \"active\": true dans clips.json,")
        warn("ou utilise --all / --only NAME.")
        return 0

    # Validation préalable de tous les clips sélectionnés.
    problems = False
    for clip in selected:
        errs = validate_clip(clip)
        if errs:
            problems = True
            fail(f"Clip « {clip.get('name', '?')} » invalide : {'; '.join(errs)}")
    if problems:
        return 1

    info(f"{len(selected)} clip(s) à traiter.")

    client = None if args.dry_run else build_client()

    ok_count = 0
    for clip in selected:
        if generate_clip(client, clip, args.dry_run):
            ok_count += 1

    info(f"\nTerminé : {ok_count}/{len(selected)} clip(s) réussi(s).")
    if not args.dry_run:
        info(f"Journal : {LOG_FILE.relative_to(ROOT)}")
    return 0 if ok_count == len(selected) else 1


if __name__ == "__main__":
    sys.exit(main())
