<p align="center">
  <img src="client/public/favicon.png" alt="CharaforgeAI logo" width="72" />
</p>

# CharaforgeAI

CharaforgeAI turns a hand-drawn character sketch into a polished fantasy RPG illustration and a short character profile. You can download your creation or publish it to the community gallery, where visitors can browse, like, and download published characters.

## Features

- Draw a sketch with adjustable brush size and color.
- Generate an illustration and character profile from a name, optional description, and visual style.
- Download generated artwork or publish it to the gallery.
- Browse gallery characters by newest, oldest, or most liked.
- Switch between light and dark themes.

## Project structure

```text
client/                  React 19, Vite, Tailwind CSS frontend
server/                  Express API
server/migrations/       PostgreSQL schema
vercel.json              Vercel multi-service routing
```

## Requirements

- Node.js 20 or newer
- npm
- A PostgreSQL database
- A Google Gemini API key and Cloudflare account/API token for character generation

## Setup

Install dependencies in the project root and each app:

```bash
npm install
npm --prefix client install
npm --prefix server install
```

Create a `.env` file at the project root with the following values:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
GEMINI_API_KEY=your_gemini_api_key
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
PORT=5000
```

The server loads the root `.env` file during local development. Apply the database schema:

```bash
psql "$DATABASE_URL" -f server/migrations/001_create_characters.sql
```

The migration creates the `characters` table used for published gallery entries and likes.

## Run locally

Start the API in one terminal:

```bash
npm --prefix server run dev
```

Start the frontend in another terminal:

```bash
npm --prefix client run dev
```

The API listens on port `5000` by default. The frontend sends API requests to `/api/*`; configure your local development environment to route those requests to the API server (the Vite config currently has no API proxy). In deployment, `vercel.json` routes `/api/*` to the Express service and all other requests to the Vite client.

## API routes

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check that the API is running |
| `POST` | `/api/generate` | Generate a character image and profile from a sketch |
| `GET` | `/api/characters` | List gallery characters |
| `POST` | `/api/characters` | Save a character to the gallery |
| `PATCH` | `/api/characters/:id/like` | Add a like to a character |

## Build and lint

```bash
npm run build
npm --prefix client run lint
```

## Deployment

The repository includes a Vercel multi-service configuration. Set `DATABASE_URL`, `GEMINI_API_KEY`, `CLOUDFLARE_ACCOUNT_ID`, and `CLOUDFLARE_API_TOKEN` in the deployment environment, and ensure the PostgreSQL schema has been applied before using gallery features.
