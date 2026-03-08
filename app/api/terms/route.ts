import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT term_id, term_name
      FROM term
      ORDER BY term_id ASC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error("GET TERMS ERROR:", error)
    return NextResponse.json(
      { error: "Failed to fetch terms" },
      { status: 500 }
    )
  }
}