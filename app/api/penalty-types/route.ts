import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT
        penalty_type_id,
        penalty_name,
        description,
        default_amount
      FROM penalty_type
      ORDER BY penalty_name ASC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error("GET PENALTY TYPES ERROR:", error)
    return NextResponse.json(
      { error: "Failed to fetch penalty types" },
      { status: 500 }
    )
  }
}