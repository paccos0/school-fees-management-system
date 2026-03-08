import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT category_id, category_name
      FROM student_category
      ORDER BY category_name ASC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error("GET STUDENT CATEGORIES ERROR:", error)
    return NextResponse.json(
      { error: "Failed to fetch student categories" },
      { status: 500 }
    )
  }
}