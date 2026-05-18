# MI Offset – Odor Dispersion Map

MI Offset is a web application that calculates how far odor will travel based on site details and wind patterns. This repo is the front-end interface. See the About page within the app for more details.

**Tech stack:**
- [SvelteKit 2](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev) (runes mode)
- [Leaflet](https://leafletjs.com/) + [OpenStreetMap](https://www.openstreetmap.org/) interactive map - tiles
- [TomTom Search API](https://developer.tomtom.com/) - address geocoding
- [Vercel](https://vercel.com/pricing)
- TypeScript, Vite

**Deployment:** Uses the native `adapter-auto` with Vercel. The app contains server-side routes, so it requires Vercel's serverless setup - in its current state it cannot be hosted on a purely static file host (like github pages).

---

## Requirements

- **[Node.js 22+](https://nodejs.org/en/download)**
- **[pnpm](https://pnpm.io/installation)**
- **[TomTom Developer account](https://developer.tomtom.com/)** with an API key
  - Register → keys → API & SDK Keys → Copy the API key
- **[Vercel account](https://vercel.com/)** (Needed for deployment only)

---

## Getting Started

1. Clone the repo
2. Create a `.env` file in the project root:

   ```sh
   TOMTOM_API_KEY="your_key_here"
   baseURL="api.tomtom.com"
   apiVersion=2
   ```

   Never commit `.env` - it is already in `.gitignore`.

3. Install dependencies:

   ```sh
   pnpm install
   ```

---

## Developing

No build step needed before running the dev server:

```sh
pnpm dev

# or open the app in a new browser tab automatically:
pnpm dev -- --open
```

---

## Building

Build a production version of the app:

```sh
pnpm build
```

Preview the production build locally before deploying:

```sh
pnpm preview
```

---

## Deploying to Vercel

1. Push the repo to GitHub
2. Import the repo in the [Vercel dashboard](https://vercel.com/new)
3. In the Vercel project settings under **Environment Variables**, add all four variables from the `.env` file above
4. Open Settings → Build And Deployment
5. Override install command, replace with `pnpm install`
6. Deploy - Vercel detects SvelteKit via `adapter-auto` and configures automatically
7. Subsequent pushes to `main` redeploy automatically with the same environment variables

Alternatively, you could deploy via the [Vercel CLI](https://vercel.com/docs/cli):

```sh
vercel deploy
```

---

## Free Tier Limits

This project relies on services with free tier usage limits:

| Service | Free Tier Limit | Details |
|---|---|---|
| TomTom Search API | 2,500 daily transactions | [developer.tomtom.com/pricing](https://developer.tomtom.com/pricing) |
| OpenStreetMap Tiles | No key required. Heavy usage violates the usage policy. | [OSM Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/) |
| Vercel Hobby Plan | 100 GB bandwidth/month, limited serverless invocations | [vercel.com/pricing](https://vercel.com/pricing) |
