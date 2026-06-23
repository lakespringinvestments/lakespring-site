import { NextResponse } from "next/server";

const PUBLICATION_ID = "0a30b2d5-820a-460f-b5da-e166b7ae408f";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const apiKey = process.env.BEEHIIV_API_KEY;

    if (!apiKey) {
      // Fallback: log the attempt and return success
      // In production, set BEEHIIV_API_KEY in Vercel env vars
      console.warn("BEEHIIV_API_KEY not set — subscriber not added:", email);
      return NextResponse.json(
        { error: "Newsletter signup is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "website",
          utm_medium: "organic",
          utm_campaign: "inline_signup",
        }),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("Beehiiv API error:", res.status, body);

      // Beehiiv returns 409 if already subscribed
      if (res.status === 409) {
        return NextResponse.json({ success: true, alreadySubscribed: true });
      }

      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
