# ClipBot AI — starter website

A Next.js starter for a permission-first Twitch/YouTube clip publishing dashboard. It includes a responsive dashboard, a Prisma database schema, and OAuth initiation/callback routes for Twitch and YouTube.

## Important: what works and what is not built yet

- The dashboard and navigation work.
- Twitch and YouTube OAuth routes are implemented, but they require your own developer credentials, a deployed HTTPS callback URL, and a production database.
- OAuth tokens are stored in the database in this starter. **Before public production use, add authenticated user accounts, encrypt tokens at rest, implement token refresh/revocation, rate limits, audit logs, and secure multi-tenant ownership.**
- The clip discovery, highlight detection, transcoding, scheduled worker, and automatic YouTube upload pipeline are **not implemented yet**. The UI does not claim to publish clips automatically.
- The streamer permission checkbox is an operator attestation, not proof of consent. Keep written consent and honor takedown requests.

## Run locally

1. Install Node.js 20+.
2. Unzip the project and open a terminal in this folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local` and set `APP_URL=http://localhost:3000`, a long random `APP_SECRET`, and platform credentials.
5. Run `npx prisma db push`.
6. Run `npm run dev` and open http://localhost:3000.

## Twitch OAuth setup

1. Create an application in the Twitch Developer Console.
2. Set the OAuth redirect URL to `http://localhost:3000/api/connect/twitch/callback` for local testing.
3. Copy the Client ID and Client Secret into `.env.local`.
4. The starter requests `user:read:email` and `clips:edit`. Review Twitch's current developer policies and scopes before production.

## YouTube OAuth setup

1. Create a project in Google Cloud Console and enable YouTube Data API v3.
2. Configure the OAuth consent screen and create an OAuth Client ID of type Web application.
3. Add `http://localhost:3000/api/connect/youtube/callback` as an authorized redirect URI.
4. Put the client ID and secret in `.env.local`.
5. YouTube may require OAuth app verification or additional review for production use. Follow Google's current API Services User Data Policy and YouTube API policies.

## Deploy

Deploy to a Node-compatible host such as Render, Railway, or a VPS. Use PostgreSQL in production (update the Prisma datasource/provider and `DATABASE_URL`), set `APP_URL` to your HTTPS domain, and register the exact production callback URLs with Twitch and Google.

## Next engineering milestones

1. Add sign-in and isolate every connection by owner.
2. Encrypt provider tokens and implement refresh/revoke flows.
3. Build a consent invitation/verification flow for each streamer.
4. Discover stream metadata and authorized clip moments using platform APIs.
5. Add a worker/queue for clipping, captions, vertical reframing, and moderation.
6. Upload to the selected YouTube channel with title, description, visibility, quotas, retries, and audit history.
7. Add explicit opt-in, rate limits, review controls, and creator takedown workflow before enabling full automation.
