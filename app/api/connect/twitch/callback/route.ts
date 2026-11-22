import { NextRequest, NextResponse } from "next/server";
import { appUrl, verifyOAuthState } from "@/lib/oauth";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  const code=req.nextUrl.searchParams.get("code"), state=req.nextUrl.searchParams.get("state");
  if(!await verifyOAuthState("twitch",state) || !code) return NextResponse.redirect(`${appUrl()}/?error=twitch_oauth`);
  try {
    const tokenRes=await fetch("https://id.twitch.tv/oauth2/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:process.env.TWITCH_CLIENT_ID!,client_secret:process.env.TWITCH_CLIENT_SECRET!,code,grant_type:"authorization_code",redirect_uri:`${appUrl()}/api/connect/twitch/callback`})});
    const token=await tokenRes.json();
    if(!token.access_token) throw new Error("Token exchange failed");
    const userRes=await fetch("https://api.twitch.tv/helix/users",{headers:{"Client-Id":process.env.TWITCH_CLIENT_ID!,"Authorization":`Bearer ${token.access_token}`}});
    const data=await userRes.json(), user=data.data?.[0];
    if(!user) throw new Error("Could not identify Twitch user");
    await prisma.connection.upsert({where:{provider_providerUser:{provider:"twitch",providerUser:user.id}},create:{provider:"twitch",providerUser:user.id,displayName:user.display_name,accessToken:token.access_token,refreshToken:token.refresh_token??null,expiresAt:new Date(Date.now()+token.expires_in*1000)},update:{displayName:user.display_name,accessToken:token.access_token,refreshToken:token.refresh_token??null,expiresAt:new Date(Date.now()+token.expires_in*1000)}});
    return NextResponse.redirect(`${appUrl()}/?connected=twitch`);
  } catch { return NextResponse.redirect(`${appUrl()}/?error=twitch_callback`); }
}
