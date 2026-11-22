import { NextResponse } from "next/server";
import { appUrl, configured, setOAuthState } from "@/lib/oauth";
export async function GET() {
  if (!configured("TWITCH_CLIENT_ID","TWITCH_CLIENT_SECRET","APP_URL","APP_SECRET")) {
    return NextResponse.redirect(`${appUrl()}/?setup=twitch`);
  }
  const state = await setOAuthState("twitch");
  const params = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID!,
    redirect_uri: `${appUrl()}/api/connect/twitch/callback`,
    response_type: "code", scope: "user:read:email clips:edit", state
  });
  return NextResponse.redirect(`https://id.twitch.tv/oauth2/authorize?${params}`);
}
