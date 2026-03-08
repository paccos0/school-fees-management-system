import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const {
      student_id,
      penalty_type_id,
      amount,
      description,
      issued_date,
      status,
    } = await req.json()

    await db.query(
      `
      UPDATE student_penalty
      SET
        student_id = ?,
        penalty_type_id = ?,
        amount = ?,
        description = ?,
        issued_date = ?,
        status = ?
      WHERE student_penalty_id = ?
      `,
      [
        student_id,
        penalty_type_id,
        amount,
        description || null,
        issued_date,
        status,
        id,
      ]
    )

    return NextResponse.json({
      success: true,
      message: "Penalty updated successfully",
    })
  } catch (error) {
    console.error("UPDATE PENALTY ERROR:", error)
    return NextResponse.json(
      { error: "Failed to update penalty" },
      { status: 500 }
    )
  }
}