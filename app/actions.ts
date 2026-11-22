
"use server";

import { prisma } from "@/lib/prisma";

export async function saveStreamer(
  name: string,
  platform: string,
  permission: boolean
) {
  if (
    !name.trim() ||
    !["Twitch", "YouTube"].includes(platform) ||
    permission !== true
  ) {
    return { error: "Valid streamer details and permission required" };
  }

  // Authorization must be added before enabling writes.
  return { error: "Saving is not enabled yet." };
}
