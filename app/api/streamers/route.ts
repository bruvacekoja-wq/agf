
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const streamers = await prisma.streamer.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json(streamers);
  } catch (error) {
    console.error("Streamer database query failed:", error);

    return Response.json(
      { error: "Unable to load streamers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    const expectedKey = process.env.CLIPBOT_ADMIN_KEY;
  const providedKey = request.headers.get("x-clipbot-admin-key");

  if (!expectedKey || providedKey !== expectedKey) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const body = await request.json();
    const { name, platform, permission } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !["Twitch", "YouTube"].includes(platform) ||
      permission !== true
    ) {
      return Response.json(
        { error: "Valid streamer details and permission required" },
        { status: 400 }
      );
    }

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

    return Response.json(streamer, { status: 201 });
  } catch (error) {
    console.error("Unable to save streamer:", error);
    return Response.json(
      { error: "Unable to save streamer" },
      { status: 500 }
    );
  }
}

