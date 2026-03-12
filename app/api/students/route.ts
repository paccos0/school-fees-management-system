import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

async function getSessionAdminId(req: NextRequest) {
  const session = req.cookies.get("sfms_session")

  if (!session?.value) {
    return null
  }

  const adminId = Number(session.value)
  return adminId || null
}

async function generateRegistrationNumber() {
  const [rows]: any = await db.query(
    `
    SELECT student_id
    FROM student
    ORDER BY student_id DESC
    LIMIT 1
    `
  )

  const lastId = rows.length ? Number(rows[0].student_id) : 0
  const nextId = lastId + 1

  return `STD${String(nextId).padStart(3, "0")}`
}

export async function GET() {
  try {
    const [rows]: any = await db.query(
      `
      SELECT
        s.student_id,
        s.registration_number,
        s.first_name,
        s.last_name,
        s.gender,
        s.class_id,
        c.class_name,
        c.section,
        s.category_id,
        sc.category_name,
        s.admission_type,
        s.status
      FROM student s
      INNER JOIN class c ON s.class_id = c.class_id
      INNER JOIN student_category sc ON s.category_id = sc.category_id
      ORDER BY s.student_id DESC
      `
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error)
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminId = await getSessionAdminId(req)

    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const first_name = body.first_name?.trim()
    const last_name = body.last_name?.trim()
    const gender = body.gender?.trim()
    const class_id = Number(body.class_id)
    const category_id = Number(body.category_id)
    const admission_type = body.admission_type?.trim()

    if (
      !first_name ||
      !last_name ||
      !gender ||
      !class_id ||
      !category_id ||
      !admission_type
    ) {
      return NextResponse.json(
        { error: "All student fields are required" },
        { status: 400 }
      )
    }

    if (!["Male", "Female"].includes(gender)) {
      return NextResponse.json(
        { error: "Invalid gender value" },
        { status: 400 }
      )
    }

    if (!["new", "continuing"].includes(admission_type)) {
      return NextResponse.json(
        { error: "Invalid admission type" },
        { status: 400 }
      )
    }

    const [classRows]: any = await db.query(
      `SELECT class_id FROM class WHERE class_id = ? LIMIT 1`,
      [class_id]
    )

    if (!classRows.length) {
      return NextResponse.json({ error: "Selected class not found" }, { status: 404 })
    }

    const [categoryRows]: any = await db.query(
      `SELECT category_id FROM student_category WHERE category_id = ? LIMIT 1`,
      [category_id]
    )

    if (!categoryRows.length) {
      return NextResponse.json(
        { error: "Selected student category not found" },
        { status: 404 }
      )
    }

    const registration_number = await generateRegistrationNumber()

    const [result]: any = await db.query(
      `
      INSERT INTO student (
        registration_number,
        first_name,
        last_name,
        gender,
        class_id,
        status,
        category_id,
        admission_type
      )
      VALUES (?, ?, ?, ?, ?, 'active', ?, ?)
      `,
      [
        registration_number,
        first_name,
        last_name,
        gender,
        class_id,
        category_id,
        admission_type,
      ]
    )

    const newStudentId = result.insertId

    const [rows]: any = await db.query(
      `
      SELECT
        s.student_id,
        s.registration_number,
        s.first_name,
        s.last_name,
        s.gender,
        s.class_id,
        c.class_name,
        c.section,
        s.category_id,
        sc.category_name,
        s.admission_type,
        s.status
      FROM student s
      INNER JOIN class c ON s.class_id = c.class_id
      INNER JOIN student_category sc ON s.category_id = sc.category_id
      WHERE s.student_id = ?
      LIMIT 1
      `,
      [newStudentId]
    )

    return NextResponse.json(
      {
        message: "Student added successfully",
        student: rows[0],
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("ADD STUDENT ERROR:", error)

    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Duplicate student data detected" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 }
    )
  }
}