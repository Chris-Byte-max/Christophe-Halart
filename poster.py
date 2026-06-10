#!/usr/bin/env python3
"""
poster.py — Affiche bonus « ANN — 25 YEARS » via l'endpoint text-to-image de Runway.

Génère une affiche à partir d'un prompt (typographie + direction artistique),
optionnellement guidée par une ou plusieurs photos de référence (pour garder
la ressemblance de Ann). Réutilise les briques de animate.py (client Runway,
polling, téléchargement, journal de production).

Usage :
    python poster.py                                  # affiche par défaut
    python poster.py --prompt "..."                   # prompt personnalisé
    python poster.py --model gpt_image_2 --ratio 1440:1920
    python poster.py --ref photos/ann_portrait_1999.jpg --ref-tag ann
    python poster.py --out output/affiche_ann.png
    python poster.py --seed 12345
    python poster.py --dry-run
"""

from __future__ import annotations

import argparse
import base64
import mimetypes
import random
import sys
from datetime import datetime, timezone
from pathlib import Path

# Réutilise les briques déjà testées du pipeline d'animation.
from animate import (
    ROOT,
    OUTPUT_DIR,
    append_log,
    build_client,
    download,
    fail,
    info,
    poll_task,
)

# Ratios valides par modèle (tirés du SDK Runway). Permet un message d'erreur
# clair au lieu d'un échec API obscur.
_GEN4 = {
    "1024:1024", "1080:1080", "1168:880", "1360:768", "1440:1080", "1080:1440",
    "1808:768", "1920:1080", "1080:1920", "2112:912", "1280:720", "720:1280",
    "720:720", "960:720", "720:960", "1680:720",
}
_GPT_IMAGE_2 = {
    "2048:880", "1920:1088", "1920:1280", "1920:1440", "1920:1536", "1920:1920",
    "1536:1920", "1440:1920", "1280:1920", "1088:1920", "2912:1248", "2560:1440",
    "2560:1712", "2560:1920", "2560:2048", "2560:2560", "2048:2560", "1920:2560",
    "1712:2560", "1440:2560", "3840:1648", "3840:2160", "3504:2336", "3264:2448",
    "3200:2560", "2880:2880", "2560:3200", "2448:3264", "2336:3504", "2160:3840",
    "auto",
}
_GEMINI_3_PRO = {
    "1344:768", "768:1344", "1024:1024", "1184:864", "864:1184", "1536:672",
    "832:1248", "1248:832", "896:1152", "1152:896", "2048:2048", "1696:2528",
    "2528:1696", "1792:2400", "2400:1792", "1856:2304", "2304:1856", "1536:2752",
    "2752:1536", "3168:1344", "4096:4096", "3392:5056", "5056:3392", "3584:4800",
    "4800:3584", "3712:4608", "4608:3712", "3072:5504", "5504:3072", "6336:2688",
}

RATIOS_BY_MODEL = {
    "gen4_image": _GEN4,
    "gen4_image_turbo": _GEN4,
    "gpt_image_2": _GPT_IMAGE_2,
    "gemini_image3_pro": _GEMINI_3_PRO,
}

# Modèles acceptant des images de référence avec tag (référençables dans le prompt).
REF_CAPABLE = {"gpt_image_2", "gemini_image3_pro", "gen4_image", "gen4_image_turbo"}

DEFAULT_MODEL = "gemini_image3_pro"   # excellent rendu de texte/typographie
DEFAULT_RATIO = "1792:2400"           # portrait 2K, format affiche
DEFAULT_OUT = OUTPUT_DIR / "affiche_ann_25ans.png"

DEFAULT_PROMPT = (
    "A warm, elegant 25th-anniversary tribute poster. Bold refined typographic "
    "title reading exactly \"ANN — 25 YEARS\", clean modern serif lettering, "
    "perfectly legible and centered. Soft celebratory atmosphere with subtle "
    "golden light, delicate confetti and bokeh, tasteful and timeless design, "
    "generous negative space, premium print quality, photorealistic lighting."
)


def to_uri(ref: str) -> str:
    """Une référence est soit une URL http(s) (passée telle quelle), soit un
    fichier local converti en data URI base64."""
    if ref.startswith(("http://", "https://", "data:")):
        return ref
    path = Path(ref)
    if not path.is_absolute():
        path = (ROOT / ref).resolve()
    if not path.exists():
        raise FileNotFoundError(f"Image de référence introuvable : {path}")
    mime, _ = mimetypes.guess_type(str(path))
    mime = mime or "image/jpeg"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def parse_args(argv=None):
    p = argparse.ArgumentParser(description="Génère l'affiche bonus ANN — 25 YEARS (Runway text-to-image)")
    p.add_argument("--prompt", default=DEFAULT_PROMPT, help="prompt de l'affiche")
    p.add_argument("--model", default=DEFAULT_MODEL, choices=sorted(RATIOS_BY_MODEL), help="modèle Runway")
    p.add_argument("--ratio", default=DEFAULT_RATIO, help="format de sortie (doit être valide pour le modèle)")
    p.add_argument("--ref", action="append", default=[], metavar="IMG", help="image de référence (URL ou fichier local), répétable")
    p.add_argument("--ref-tag", action="append", default=[], metavar="TAG", help="tag associé à la référence (même ordre que --ref)")
    p.add_argument("--seed", type=int, help="seed (sinon généré et consigné)")
    p.add_argument("--out", type=Path, default=DEFAULT_OUT, help="fichier de sortie")
    p.add_argument("--dry-run", action="store_true", help="ne pas appeler l'API, montrer le plan")
    return p.parse_args(argv)


def build_reference_images(refs: list[str], tags: list[str]) -> list[dict]:
    images = []
    for i, ref in enumerate(refs):
        item = {"uri": to_uri(ref)}
        if i < len(tags) and tags[i]:
            item["tag"] = tags[i]
        images.append(item)
    return images


def main(argv=None) -> int:
    args = parse_args(argv)

    valid = RATIOS_BY_MODEL[args.model]
    if args.ratio not in valid:
        fail(
            f"Ratio « {args.ratio} » non supporté par {args.model}.\n"
            f"   Valides : {', '.join(sorted(valid))}"
        )
        return 1

    if args.ref and args.model not in REF_CAPABLE:
        fail(f"{args.model} n'accepte pas d'images de référence. Modèles compatibles : {', '.join(sorted(REF_CAPABLE))}")
        return 1

    seed = args.seed if args.seed is not None else random.randint(0, 2**32 - 1)

    info("🖼️  Affiche bonus")
    info(f"   modèle={args.model}  ratio={args.ratio}  seed={seed}")
    info(f"   sortie={args.out}")
    info(f"   prompt: {args.prompt}")

    try:
        reference_images = build_reference_images(args.ref, args.ref_tag)
    except FileNotFoundError as exc:
        fail(str(exc))
        return 1
    if reference_images:
        info(f"   références: {len(reference_images)} image(s)")

    if args.dry_run:
        info("   (dry-run : aucun appel API)")
        return 0

    client = build_client()

    params = {
        "model": args.model,
        "prompt_text": args.prompt,
        "ratio": args.ratio,
        "seed": seed,
    }
    if reference_images:
        params["reference_images"] = reference_images

    started = datetime.now(timezone.utc)
    try:
        task = client.text_to_image.create(**params)
    except Exception as exc:  # noqa: BLE001
        fail(f"Échec de la création de la tâche : {exc}")
        return 1

    info(f"   tâche créée : {task.id} — génération en cours…")
    output_urls = poll_task(client, task.id)

    if output_urls is None:
        append_log({
            "timestamp": started.isoformat(),
            "type": "poster",
            "name": args.out.stem,
            "model": args.model,
            "ratio": args.ratio,
            "seed": seed,
            "prompt": args.prompt,
            "task_id": task.id,
            "status": "FAILED",
            "output_file": None,
            "output_url": None,
        })
        return 1

    args.out.parent.mkdir(parents=True, exist_ok=True)
    ok = download(output_urls[0], args.out)

    append_log({
        "timestamp": started.isoformat(),
        "type": "poster",
        "name": args.out.stem,
        "model": args.model,
        "ratio": args.ratio,
        "seed": seed,
        "prompt": args.prompt,
        "task_id": task.id,
        "status": "SUCCEEDED" if ok else "DOWNLOAD_FAILED",
        "output_file": str(args.out.relative_to(ROOT)) if ok else None,
        "output_url": output_urls[0],
    })

    if ok:
        info(f"   ✅ {args.out.relative_to(ROOT)}")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
