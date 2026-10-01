import { revalidateTag } from "next/cache";
import { syncHevy } from "@/server/hevy/sync";

export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncHevy();
    revalidateTag("hevy", "max");
    return Response.json(result);
  } catch (error) {
    console.error("Hevy sync failed:", error);
    return Response.json({ error: error instanceof Error ? error.message : "Sync failed" }, { status: 500 });
  }
}
