import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT
        fs.fee_id,
        fs.class_id,
        c.class_name,
        c.section,
        fs.term_id,
        t.term_name,
        fs.category_id,
        sc.category_name,
        fs.admission_type,
        fs.total_fee
      FROM fee_structure fs
      INNER JOIN class c ON fs.class_id = c.class_id
      INNER JOIN term t ON fs.term_id = t.term_id
      INNER JOIN student_category sc ON fs.category_id = sc.category_id
      ORDER BY fs.fee_id DESC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error("GET FEES ERROR:", error)
    return NextResponse.json(
      { error: "Failed to fetch fees" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const {
      class_id,
      term_id,
      category_id,
      admission_type,
      total_fee,
    } = await req.json()

    if (
      !class_id ||
      !term_id ||
      !category_id ||
      !admission_type ||
      !total_fee
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const [existing]: any = await db.query(
      `
      SELECT fee_id
      FROM fee_structure
      WHERE class_id = ? AND term_id = ? AND category_id = ? AND admission_type = ?
      LIMIT 1
      `,
      [class_id, term_id, category_id, admission_type]
    )

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "This fee structure already exists" },
        { status: 409 }
      )
    }

    const [result]: any = await db.query(
      `
      INSERT INTO fee_structure
      (class_id, term_id, category_id, admission_type, total_fee)
      VALUES (?, ?, ?, ?, ?)
      `,
      [class_id, term_id, category_id, admission_type, total_fee]
    )

    return NextResponse.json({
      success: true,
      message: "Fee structure added successfully",
      fee_id: result.insertId,
    })
  } catch (error) {
    console.error("POST FEES ERROR:", error)
    return NextResponse.json(
      { error: "Failed to add fee structure" },
      { status: 500 }
    )
  }
}