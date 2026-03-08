import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const {
      class_id,
      term_id,
      category_id,
      admission_type,
      total_fee,
    } = await req.json()

    await db.query(
      `
      UPDATE fee_structure
      SET
        class_id = ?,
        term_id = ?,
        category_id = ?,
        admission_type = ?,
        total_fee = ?
      WHERE fee_id = ?
      `,
      [class_id, term_id, category_id, admission_type, total_fee, id]
    )

    return NextResponse.json({
      success: true,
      message: "Fee structure updated successfully",
    })
  } catch (error) {
    console.error("UPDATE FEES ERROR:", error)
    return NextResponse.json(
      { error: "Failed to update fee structure" },
      { status: 500 }
    )
  }
}