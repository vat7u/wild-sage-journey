import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CONTENT_TAGS } from "@/lib/sanity/client";

/**
 * Called by a Sanity webhook whenever a published document is created,
 * updated or deleted. Expires the cached queries for that document type, so
 * every page that shows it is rebuilt on its next visit.
 *
 * Webhook settings (sanity.io/manage → API → Webhooks):
 *   URL         https://<site>/api/revalidate   (POST)
 *   Trigger on  Create, Update, Delete; drafts off
 *   Projection  {_type}
 *   Secret      same value as SANITY_REVALIDATE_SECRET
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not configured" }, { status: 500 });
  }

  try {
    // `true` waits briefly so the content lake has the change before pages re-query it
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    const type = body?._type;
    if (!type || !(CONTENT_TAGS as readonly string[]).includes(type)) {
      return NextResponse.json({ message: `Ignored document type: ${type ?? "none"}` }, { status: 200 });
    }

    revalidateTag(type);
    return NextResponse.json({ revalidated: true, tag: type, now: Date.now() });
  } catch (err) {
    console.error("Revalidation webhook failed:", err);
    return NextResponse.json({ message: "Error while revalidating" }, { status: 500 });
  }
}
