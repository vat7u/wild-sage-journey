# api/revalidate

## Overview
Webhook endpoint that keeps the site in step with Sanity. Sanity calls it after a published document is created, updated or deleted; it revalidates the cache tag of that document type so affected pages are regenerated on their next visit.

## Interface
- `route.ts:POST(req)` — verifies the `sanity-webhook-signature` header with `parseBody` from `next-sanity/webhook` and `SANITY_REVALIDATE_SECRET`, then calls `revalidateTag(body._type)`.
- Responses: `200 {revalidated: true, tag}`; `200` "Ignored document type" for types outside `CONTENT_TAGS`; `401` invalid signature; `500` when the secret is not configured or revalidation throws.

## Invariants
- Requires `SANITY_REVALIDATE_SECRET` in the environment (Vercel and `.env.local`) and the same secret in the Sanity webhook.
- Webhook configuration (sanity.io/manage → API → Webhooks): URL `https://<site>/api/revalidate`, POST, trigger on create/update/delete, drafts off, projection `{_type}`, API version `v2024-03-01`.
- Tags must match `CONTENT_TAGS` in `src/lib/sanity/client.ts` (the getters tag their fetches with the same names).
- `parseBody(..., true)` waits briefly for content-lake consistency before revalidating.

## Side Effects
- Expires Next.js data-cache entries and the pages built from them; no writes to Sanity.
- Logs `Revalidation webhook failed:` on errors.

## Verification
- Send a signed POST (HMAC-SHA256 of `${timestamp}.${body}` with the secret, base64url, header `t=<ts>,v1=<sig>`) with body `{"_type":"siteSettings"}` and confirm a changed Site Settings value appears; an unsigned or wrongly signed request returns 401.
