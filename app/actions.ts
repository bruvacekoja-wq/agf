
"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export async function saveStreamer(
  name: string,
  platform: string,
  permission: boolean,
  accessToken: string
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminUid = process.env.CLIPBOT_ADMIN_UID;

  if (!supabaseUrl || !supabaseKey || !adminUid) {
    return { error: "Server authentication is not configured." };
  }

  if (!accessToken) {
    return { error: "Please sign in first." };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user || data.user.id !== adminUid) {
    return { error: "Unauthorized. Admin login required." };
  }

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !["Twitch", "YouTube"].includes(platform) ||
    permission !== true
  ) {
    return { error: "Valid streamer details and permission required." };
  }

  try {
    const streamer = await prisma.streamer.upsert({
      where: {
        provider_providerId: {
          provider: platform.toLowerCase(),
          providerId: name.trim().toLowerCase(),
        },
      },
      update: {
        displayName: name.trim(),
        permission: true,
      },
      create: {
        provider: platform.toLowerCase(),
        providerId: name.trim().toLowerCase(),
        displayName: name.trim(),
        permission: true,
      },
    });

    return { success: true, streamer };
  } catch {
    return { error: "Unable to save streamer." };
  }
}
