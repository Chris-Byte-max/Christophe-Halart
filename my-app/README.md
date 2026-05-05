# RGF Staffing — BA-BI Analytics Portal

Portail analytique pour les Data Stratégistes de RGF Staffing.

## Démarrage rapide

```bash
npm install
cp .env.example .env.local
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## Connexion

- **Email** : `data@rgfstaffing.be`
- **Mot de passe** : `RGF2026!`

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Recharts
- NextAuth.js

## Routes

| Route | Description |
|---|---|
| `/login` | Page de connexion |
| `/dashboard` | Vue d'ensemble |
| `/dashboard/omnitracker` | Calls OmniTracker |
| `/dashboard/brands` | Toutes les marques |
| `/dashboard/brands/[opco]` | Détail par marque |
| `/dashboard/reports` | Rapports direction |
