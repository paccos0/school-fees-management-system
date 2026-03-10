import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = Number(params.id)

    if (!studentId) {
      return NextResponse.json(
        { error: "Invalid student id" },
        { status: 400 }
      )
    }

    const [rows]: any = await db.query(
      `
      SELECT
        fs.fee_id,
        fs.scope_type,
        fs.class_id,
        fs.term_id,
        t.term_name,
        fs.category_id,
        sc.category_name,
        fs.admission_type,
        fs.total_fee,
        c.class_name,
        c.section
      FROM fee_structure fs
      JOIN student s ON s.student_id = ?
      JOIN term t ON t.term_id = fs.term_id AND t.is_current = 1
      JOIN student_category sc ON sc.category_id = fs.category_id
      LEFT JOIN class c ON c.class_id = fs.class_id
      WHERE fs.category_id = s.category_id
        AND fs.admission_type = s.admission_type
        AND (
          (fs.scope_type = 'class' AND fs.class_id = s.class_id)
          OR
          (fs.scope_type = 'general' AND fs.class_id IS NULL)
        )
      ORDER BY
        CASE
          WHEN fs.scope_type = 'class' THEN 1
          WHEN fs.scope_type = 'general' THEN 2
          ELSE 3
        END,
        fs.fee_id DESC
      `,
      [studentId]
    )

    const formatted = rows.map((row: any) => ({
      ...row,
      scope_label:
        row.scope_type === "general"
          ? "General"
          : `${row.class_name || ""}${row.section ? ` ${row.section}` : ""}`.trim(),
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error("GET APPLICABLE FEES ERROR:", error)
    return NextResponse.json(
      { error: "Failed to fetch applicable fee structures" },
      { status: 500 }
    )
  }
}