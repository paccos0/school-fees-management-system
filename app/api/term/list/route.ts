import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT
        t.term_id,
        t.term_name,
        ay.year_name,
        t.is_current
      FROM term t
      JOIN academic_year ay ON ay.year_id = t.year_id
      ORDER BY ay.year_name DESC, t.term_id ASC
    `)

    return NextResponse.json(rows || [])
  } catch (error) {
    console.error("TERM LIST API ERROR:", error)
    return NextResponse.json([], { status: 500 })
  }
}