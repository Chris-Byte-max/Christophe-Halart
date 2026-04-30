# LESSONS

<!-- Format : [date] | ce qui a mal tourné | règle pour l'éviter -->

[2026-04-30] | `@radix-ui/react-badge` n'existe pas dans npm | Toujours vérifier l'existence d'un package npm avant de l'ajouter — utiliser `npm info <package>` si doute

[2026-04-30] | `prisma/seed.ts` était inclus dans la compilation Next.js, causant une erreur de build car `@prisma/client` n'était pas disponible au moment du build | Exclure les fichiers seed du tsconfig.json (`"exclude": ["node_modules", "prisma/seed.ts"]`)

[2026-04-30] | Instruction incomplète reçue au départ (tronquée à "group_all_brands") — la spec complète comprenait Prisma, AI service, Campaign Workspace, 24 fonctions AI, seed script, README | Toujours confirmer que l'instruction est complète avant de commencer une implémentation massive. Poser la question si le message semble tronqué.

[2026-04-30] | Build Next.js peut échouer à cause de fichiers TypeScript en dehors de `app/` et `components/` qui importent des modules non-disponibles dans le contexte frontend | Garder les fichiers backend (seed, scripts) hors du scope TypeScript de Next.js via `tsconfig.json > exclude`
