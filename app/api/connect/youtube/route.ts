import { NextResponse } from "next/server";
import { appUrl, configured, setOAuthState } from "@/lib/oauth";
export async function GET() {
  if (!configured("GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET","APP_URL","APP_SECRET")) return NextResponse.redirect(`${appUrl()}/?setup=youtube`);
  const state=await setOAuthState("youtube");
  const params=new URLSearchParams({client_id:process.env.GOOGLE_CLIENT_ID!,redirect_uri:`${appUrl()}/api/connect/youtube/callback`,response_type:"code",scope:"https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly",access_type:"offline",prompt:"consent",state});
  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
