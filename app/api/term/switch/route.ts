import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const termId = Number(body?.term_id)

    if (!termId) {
      return NextResponse.json(
        { error: "Valid term_id is required" },
        { status: 400 }
      )
    }

    await db.query(`UPDATE term SET is_current = 0`)
    await db.query(`UPDATE term SET is_current = 1 WHERE term_id = ?`, [termId])

    return NextResponse.json({
      success: true,
      message: "Term switched successfully",
    })
  } catch (error) {
    console.error("TERM SWITCH API ERROR:", error)

    return NextResponse.json(
      { error: "Failed to switch term" },
      { status: 500 }
    )
  }
}