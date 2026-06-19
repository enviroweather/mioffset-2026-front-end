# MI Offset - Odor Dispersion Map

MI Offset is a web application that calculates how far odor will travel based on site details and wind patterns. Users configure an odor source (animal housing, manure storage, or a manual emission value), pick a location on the map, and the app runs a local dispersion model to generate a footprint overlay showing setback distances at three frequency thresholds (1.5%, 3%, 5%). See the About page within the app for more details.

**Tech stack:**

- [SvelteKit 2](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev) (runes mode)
- TypeScript + JavaScript
- [Leaflet](https://leafletjs.com/) + [OpenStreetMap](https://www.openstreetmap.org/) - interactive map tiles
- [TomTom Search API](https://developer.tomtom.com/) - address geocoding + reverse geocoding
- [AWS S3](https://aws.amazon.com/s3/) - NARR wind data storage for the local dispersion model
- [Vite](https://vite.dev/) + [pnpm](https://pnpm.io/)

**Deployment:** Uses `adapter-auto` (Vercel by default). The app has server-side routes and cannot be hosted on a purely static file host (e.g. GitHub Pages). A Netlify adapter is also installed if you prefer that platform.

---

## Requirements

- **[Node.js 22+](https://nodejs.org/en/download)**
- **[pnpm](https://pnpm.io/installation)**
- **[TomTom Developer account](https://developer.tomtom.com/)** with an API key
  - Register → Keys → API & SDK Keys → Copy the API key
- **AWS account** with an S3 bucket containing NARR wind data, and an IAM user with read access
- **[Vercel account](https://vercel.com/)** (needed for deployment only)

---

## Getting Started

1. Clone the repo
2. Create a `.env` file in the project root:

   ```sh
   # TomTom geocoding
   TOMTOM_API_KEY="your_key_here"
   tomtomURL="api.tomtom.com"
   apiVersion=2

   # AWS S3 - NARR wind data for the local dispersion model
   FOD_AWS_REGION="us-east-1"
   FOD_AWS_ACCESS_KEY_ID="your_access_key_id"
   FOD_AWS_SECRET_ACCESS_KEY="your_secret_access_key"
   S3_BUCKET_NAME="your_bucket_name"

   # Passphrase gate (set ENABLED=0 to disable)
   ACCESS_PASSPHRASE="whatever you would like"
   MI_OFFSET_PASSPHRASE_ENABLED=1
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

Type-check the project (Svelte + TypeScript):

```sh
pnpm check
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
3. In the Vercel project settings under **Environment Variables**, add all variables from the `.env` file above
4. Open Settings → Build And Deployment → override the install command with `pnpm install`
5. Deploy - Vercel detects SvelteKit via `adapter-auto` and configures automatically
6. Subsequent pushes to `main` redeploy automatically

Alternatively, deploy via the [Vercel CLI](https://vercel.com/docs/cli):

```sh
vercel deploy
```

---

## Free Tier Limits

This project relies on services with free tier usage limits:

| Service             | Free Tier Limit                                         | Details                                                                       |
| ------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| TomTom Search API   | 2,500 daily transactions                                | [developer.tomtom.com/pricing](https://developer.tomtom.com/pricing)          |
| OpenStreetMap Tiles | No key required. Heavy usage violates the usage policy. | [OSM Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/) |
| AWS S3              | 5 GB storage, 20,000 GET requests/month free            | [aws.amazon.com/s3/pricing](https://aws.amazon.com/s3/pricing/)               |
| Vercel Hobby Plan   | 100 GB bandwidth/month, limited serverless invocations  | [vercel.com/pricing](https://vercel.com/pricing)                              |
