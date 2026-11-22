import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { appUrl, verifyOAuthState } from "@/lib/oauth";
import { prisma } from "@/lib/prisma";
export async function GET(req:NextRequest) {
  const code=req.nextUrl.searchParams.get("code"),state=req.nextUrl.searchParams.get("state");
  if(!await verifyOAuthState("youtube",state)||!code) return NextResponse.redirect(`${appUrl()}/?error=youtube_oauth`);
  try {
    const oauth=new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET,`${appUrl()}/api/connect/youtube/callback`);
    const {tokens}=await oauth.getToken(code); oauth.setCredentials(tokens);
    const yt=google.youtube({version:"v3",auth:oauth});
    const channel=await yt.channels.list({part:["snippet"],mine:true});
    const item=channel.data.items?.[0];
    if(!item?.id) throw new Error("No YouTube channel found");
    await prisma.connection.upsert({where:{provider_providerUser:{provider:"youtube",providerUser:item.id}},create:{provider:"youtube",providerUser:item.id,displayName:item.snippet?.title??"YouTube channel",accessToken:tokens.access_token??"",refreshToken:tokens.refresh_token??null,expiresAt:tokens.expiry_date?new Date(tokens.expiry_date):null},update:{displayName:item.snippet?.title??"YouTube channel",accessToken:tokens.access_token??"",refreshToken:tokens.refresh_token??null,expiresAt:tokens.expiry_date?new Date(tokens.expiry_date):null}});
    return NextResponse.redirect(`${appUrl()}/?connected=youtube`);
  } catch { return NextResponse.redirect(`${appUrl()}/?error=youtube_callback`); }
}
