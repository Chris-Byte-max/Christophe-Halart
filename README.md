# ANN: The Movie — pipeline d'animation Runway

Petit pipeline pour animer des photos en clips vidéo via l'API Runway (Gen-4.5),
dans le cadre de la vidéo hommage des 25 ans.

## Deux outils, deux rôles (à lire en premier)

Ce dépôt contient **deux choses** — pour éviter toute confusion :

1. **Le pipeline maison (`animate.py` / `poster.py`) — outil PRINCIPAL.**
   C'est ce que tu lances toi-même : `python animate.py`. Workflow en lot via
   `clips.json`, seed consigné, dry-run, validation. Taillé pour l'hommage.

2. **Les skills officiels Runway (`.agents/skills/`) — RÉFÉRENCE / secours.**
   Installés via `npx skills add runwayml/skills`. Pensés pour être pilotés
   par un agent IA (Claude Code). On les garde surtout pour la doc API à jour
   (`rw-api-reference`) et les modèles avancés (`seedance2`, `veo3`, audio).
   Ton `animate.py` accepte déjà ces modèles via le champ `"model"` d'un clip.

👉 Au quotidien, utilise le pipeline maison. Pioche dans les skills quand tu
veux changer de modèle ou explorer une fonctionnalité Runway plus poussée.

## Mise en route (5 minutes)

1. **Déposer le projet** dans ton dossier de travail Claude Code.
2. **Installer les dépendances** :
   ```
   pip install -r requirements.txt
   ```
3. **Configurer la clé** : copie `.env.example` en `.env` et colle ta clé Runway.
   ```
   cp .env.example .env
   ```
   Puis édite `.env`. La clé reste locale et n'est jamais commitée.
4. **Déposer les photos** dans le dossier `photos/`, en respectant les noms
   de fichiers indiqués dans `clips.json` (ou adapte `clips.json` à tes noms).

## Premier test (1 seul clip)

1. Ouvre `clips.json`, passe **un seul** clip à `"active": true`.
2. Lance :
   ```
   python animate.py
   ```
3. Regarde le `.mp4` dans `output/`. Ajuste le `prompt` si besoin, relance.

## Production complète

Une fois la direction validée clip par clip, active les clips retenus
et relance. Les résultats et les `seed` sont consignés dans
`output/production_log.json`.

## Configuration des clips (`clips.json`)

Le fichier contient un bloc `defaults` (appliqué à tous les clips) et une liste
`clips`. Chaque clip peut surcharger les valeurs par défaut.

| Champ      | Description                                                        |
|------------|--------------------------------------------------------------------|
| `name`     | Nom de sortie (donne `output/<name>.mp4`).                         |
| `image`    | Nom du fichier dans `photos/`.                                     |
| `prompt`   | Description du mouvement souhaité.                                 |
| `model`    | Modèle Runway (`gen4.5` par défaut, `gen4_turbo` possible).        |
| `ratio`    | Format de sortie (ex. `1280:720`, `720:1280`, `960:960`).          |
| `duration` | Durée en secondes (2 à 10).                                        |
| `seed`     | Optionnel. Si absent, un seed aléatoire est généré **et consigné** |
|            | pour pouvoir reproduire exactement le clip plus tard.             |
| `active`   | `true` pour traiter ce clip, `false` pour l'ignorer.              |

Ratios supportés par Gen-4.5 : `1280:720`, `1584:672`, `1104:832` (paysage),
`720:1280`, `832:1104`, `672:1584` (portrait), `960:960` (carré).

### Options de ligne de commande

```
python animate.py                 # traite tous les clips "active": true
python animate.py --all           # traite TOUS les clips (ignore "active")
python animate.py --only NAME     # traite un seul clip par son "name"
python animate.py --config FILE   # utilise un autre fichier que clips.json
python animate.py --dry-run       # affiche ce qui serait fait, sans appeler l'API
```

## Affiche bonus « ANN — 25 YEARS » (`poster.py`)

Génère une affiche via l'endpoint **text-to-image** de Runway. Par défaut,
modèle `gemini_image3_pro` (très bon rendu de la typographie) en portrait
`1792:2400`.

```
python poster.py                                  # affiche par défaut
python poster.py --prompt "..."                   # prompt personnalisé
python poster.py --model gpt_image_2 --ratio 1440:1920
python poster.py --ref photos/ann_portrait_1999.jpg --ref-tag ann
python poster.py --out output/affiche_ann.png
python poster.py --seed 12345                     # reproductibilité
python poster.py --dry-run                         # plan sans appel API
```

- `--ref` accepte une URL **ou** un fichier local (converti en data URI) ;
  répétable pour plusieurs références. `--ref-tag` donne un tag référençable
  dans le prompt (modèles compatibles : `gpt_image_2`, `gemini_image3_pro`,
  `gen4_image`, `gen4_image_turbo`).
- Le `ratio` est validé selon le modèle choisi (message d'erreur listant les
  valeurs valides si besoin).
- Comme pour les clips, le `seed` est consigné dans `output/production_log.json`
  (entrée `"type": "poster"`) pour pouvoir régénérer la même affiche.

> Astuce ressemblance : passe une photo nette de Ann en `--ref ... --ref-tag ann`
> et référence-la dans ton prompt pour intégrer son portrait à l'affiche.

## Étapes hors pipeline (montage final)

- **Restauration / upscaling** des vieilles photos : à faire AVANT
  (Topaz, Magnific…) — Runway anime mieux une photo nette.
- **Montage, textes, musique, Ken Burns** sur les photos non animées :
  dans Canva (Brand Kit déjà connecté).
- **Affiche bonus** "ANN — 25 YEARS" : désormais intégrée au pipeline via
  `poster.py` (voir la section dédiée ci-dessus).

## Sécurité
- `.env` et `photos/` sont dans `.gitignore`.
- Ne jamais coller la clé dans un chat, un commit, ou un ticket.
