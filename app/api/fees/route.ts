import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT
        fs.fee_id,
        fs.scope_type,
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
      LEFT JOIN class c ON fs.class_id = c.class_id
      INNER JOIN term t ON fs.term_id = t.term_id
      INNER JOIN student_category sc ON fs.category_id = sc.category_id
      ORDER BY fs.fee_id DESC
    `)

    const formatted = rows.map((row: any) => ({
      ...row,
      scope_label:
        row.scope_type === "general"
          ? "General"
          : `${row.class_name || ""}${row.section ? ` ${row.section}` : ""}`.trim(),
    }))

    return NextResponse.json(formatted)
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
      scope_type = "class",
      class_id,
      term_id,
      category_id,
      admission_type,
      total_fee,
    } = await req.json()

    if (!term_id || !category_id || !admission_type || total_fee === undefined || total_fee === null) {
      return NextResponse.json(
        { error: "term_id, category_id, admission_type and total_fee are required" },
        { status: 400 }
      )
    }

    if (!["class", "general"].includes(scope_type)) {
      return NextResponse.json(
        { error: "scope_type must be either 'class' or 'general'" },
        { status: 400 }
      )
    }

    if (scope_type === "class" && !class_id) {
      return NextResponse.json(
        { error: "class_id is required for class-based fee structure" },
        { status: 400 }
      )
    }

    if (scope_type === "general") {
      const [existing]: any = await db.query(
        `
        SELECT fee_id
        FROM fee_structure
        WHERE scope_type = 'general'
          AND class_id IS NULL
          AND term_id = ?
          AND category_id = ?
          AND admission_type = ?
        LIMIT 1
        `,
        [term_id, category_id, admission_type]
      )

      if (existing.length > 0) {
        return NextResponse.json(
          { error: "This general fee structure already exists" },
          { status: 409 }
        )
      }

      const [result]: any = await db.query(
        `
        INSERT INTO fee_structure
        (scope_type, class_id, term_id, category_id, admission_type, total_fee)
        VALUES ('general', NULL, ?, ?, ?, ?)
        `,
        [term_id, category_id, admission_type, total_fee]
      )

      return NextResponse.json({
        success: true,
        message: "General fee structure added successfully",
        fee_id: result.insertId,
      })
    }

    const [existing]: any = await db.query(
      `
      SELECT fee_id
      FROM fee_structure
      WHERE scope_type = 'class'
        AND class_id = ?
        AND term_id = ?
        AND category_id = ?
        AND admission_type = ?
      LIMIT 1
      `,
      [class_id, term_id, category_id, admission_type]
    )

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "This class fee structure already exists" },
        { status: 409 }
      )
    }

    const [result]: any = await db.query(
      `
      INSERT INTO fee_structure
      (scope_type, class_id, term_id, category_id, admission_type, total_fee)
      VALUES ('class', ?, ?, ?, ?, ?)
      `,
      [class_id, term_id, category_id, admission_type, total_fee]
    )

    return NextResponse.json({
      success: true,
      message: "Class fee structure added successfully",
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