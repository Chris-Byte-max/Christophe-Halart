# LESSONS

<!-- Format : [date] | ce qui a mal tourné | règle pour l'éviter -->

2026-06-10 | Écrit clips.json/animate.py en me basant sur l'API Runway de mémoire | Toujours vérifier l'API réelle (SDK, modèles, statuts de tâche) via le web avant d'écrire le client — env var `RUNWAYML_API_SECRET`, modèle `gen4.5`, poll via `client.tasks.retrieve(id)`.
2026-06-10 | Le seed n'était pas récupérable depuis l'API pour le journal | Fixer le seed côté client (random uint32) quand il est absent, le passer explicitement et le consigner — garantit la reproductibilité.
