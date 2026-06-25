# FrigoChef

Prenez une photo de votre frigo → l'IA détecte les ingrédients → 5 recettes générées instantanément.

## Installation

```bash
cd FrigoChef
npm install
```

## Variables d'environnement

Créez un fichier `.env.local` à la racine :

```bash
cp .env.example .env.local
```

Puis renseignez votre clé OpenAI dans `.env.local` :

```
OPENAI_API_KEY=sk-votre-clé-ici
```

> **Sans clé API** : le projet fonctionne en mode mock avec des données fictives. Aucune configuration requise.

## Lancement local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Déploiement sur Vercel

### Via l'interface web

1. Poussez le projet sur GitHub
2. Connectez-vous sur [vercel.com](https://vercel.com)
3. Importez le dépôt
4. Dans **Environment Variables**, ajoutez : `OPENAI_API_KEY` = votre clé
5. Cliquez **Deploy**

### Via CLI

```bash
npm i -g vercel
vercel
```

Ajoutez ensuite la variable d'environnement dans le dashboard Vercel :
**Settings → Environment Variables → `OPENAI_API_KEY`**

## Stack

- **Next.js 15** App Router
- **TypeScript**
- **Tailwind CSS**
- **OpenAI** Vision + GPT-4o-mini

## Parcours utilisateur

```
Landing → Scanner → Analyse IA → Correction ingrédients → 5 Recettes
```
