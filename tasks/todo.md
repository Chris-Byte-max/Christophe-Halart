# TODO

<!-- Format : [ ] tâche en attente | [x] tâche terminée -->

## Pipeline ANN: The Movie (Runway Gen-4.5)

Objectif : implémenter le pipeline décrit dans le README (animer des photos en
clips vidéo via l'API Runway).

### Plan
- [x] Rechercher l'API Runway réelle (SDK python, modèles, polling, data URI)
- [x] `requirements.txt` — runwayml, python-dotenv, requests
- [x] `.env.example` — variable `RUNWAYML_API_SECRET`
- [x] `.gitignore` — ignore `.env`, contenu de `photos/` et `output/`
- [x] `clips.json` — config des clips (defaults + overrides, champ `active`)
- [x] `animate.py` — script principal :
  - charge `.env`, lit `clips.json`
  - encode chaque photo active en data URI base64
  - seed généré côté client si absent (reproductibilité garantie)
  - appelle `image_to_video.create`, poll jusqu'à fin
  - télécharge le `.mp4` dans `output/`
  - consigne résultat + seed dans `output/production_log.json`
- [x] `photos/.gitkeep` et `output/.gitkeep` — garder les dossiers
- [x] `README.md` — ajouter au repo
- [x] Vérifier : compilation python, validation JSON
- [x] Commit + push sur `claude/gracious-allen-d2mty7`

### Affiche bonus (text-to-image)
- [x] Vérifier l'API text_to_image (modèles, ratios exacts par modèle)
- [x] `poster.py` — endpoint text-to-image, modèle `gemini_image3_pro` par défaut,
  validation des ratios par modèle, images de référence optionnelles (--ref/--ref-tag),
  seed consigné dans le journal (réutilise les briques de animate.py)
- [x] Documenter `poster.py` dans le README
- [x] Vérifier (compile, dry-run, validations) + commit/push
