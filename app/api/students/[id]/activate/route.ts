import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.query(
      `
      UPDATE student
      SET status = 'active'
      WHERE student_id = ?
      `,
      [id]
    )

    return NextResponse.json({
      success: true,
      message: "Student activated successfully",
    })
  } catch (error) {
    console.error("ACTIVATE STUDENT ERROR:", error)
    return NextResponse.json(
      { error: "Failed to activate student" },
      { status: 500 }
    )
  }
}