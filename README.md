# Agentic Publisher

Agentic Publisher turns a single long-form blog entry into tailored updates for multiple social platforms and publishes them in one run. The web app is built with Next.js 14 (App Router) and is ready for Vercel deployment.

## Features

- Compose, summarise, and enrich blog content in a single dashboard.
- Toggle five supported destinations (X, LinkedIn, Facebook Pages, Medium, DEV Community).
- Automatic copy optimisation per channel (hashtags, canonical references, HTML/markdown formatting).
- Real-time feedback on delivery status with granular success/skip/failure states.
- Secure, server-side API connectors ready for your own platform tokens.

## Getting Started

```bash
npm install
npm run dev
# http://localhost:3000
```

### Required Environment Variables

Create `.env.local` with the keys you intend to use. Channels without credentials are automatically skipped.

```bash
# X / Twitter
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_SECRET=

# LinkedIn
LINKEDIN_ACCESS_TOKEN=
LINKEDIN_AUTHOR_URN=urn:li:person:xxxx

# Facebook Pages
FACEBOOK_PAGE_ID=
FACEBOOK_PAGE_ACCESS_TOKEN=

# Medium
MEDIUM_TOKEN=
MEDIUM_USER_ID=

# DEV Community
DEVTO_API_KEY=
```

Run production build checks before deploying:

```bash
npm run lint
npm run type-check
npm run build
```

## Deployment

The project is configured for Vercel. Once the environment variables are set, deploy with:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-2edf5051
```

After a successful deployment, verify:

```bash
curl https://agentic-2edf5051.vercel.app
```

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- React Hook Form + Zod validation
- Platform connectors powered by official APIs (`twitter-api-v2`, REST fetches)

## Notes

- Tokens stay on the server; no credentials are exposed to the browser.
- Medium, LinkedIn, Facebook, and DEV endpoints require approval scopes aligned with publishing.
- Extendable: add new channels by replicating the connector pattern in `src/lib/platforms.ts`.
