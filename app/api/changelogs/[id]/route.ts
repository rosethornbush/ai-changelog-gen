import { db } from "@/lib/db";
import { changelogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await db.select().from(changelogs).where(eq(changelogs.id, id)).get()
  if (!data) return Response.json({ error: "Changelog not found" }, { status: 404 })
  return Response.json(data)
}
