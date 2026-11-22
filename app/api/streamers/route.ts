
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
