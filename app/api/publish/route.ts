import { db } from "@/lib/db"
import { changelogs } from "@/lib/db/schema"

export async function POST(req: Request) {
  const data = await req.json()

  try {
    const changelog = await db.insert(changelogs).values(data).returning().get();
    return Response.json(changelog)
  } catch (error) {
    console.error(error)
  }
}
