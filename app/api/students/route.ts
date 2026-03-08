import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT
        student_id,
        registration_number,
        first_name,
        last_name,
        gender,
        status
      FROM student
      ORDER BY student_id ASC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error)
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const {
      registration_number,
      first_name,
      last_name,
      gender,
      class_id,
      category_id,
      admission_type,
    } = await req.json()

    if (
      !registration_number ||
      !first_name ||
      !last_name ||
      !gender ||
      !class_id ||
      !category_id ||
      !admission_type
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      )
    }

    const [existing]: any = await db.query(
      `SELECT student_id FROM student WHERE registration_number = ? LIMIT 1`,
      [registration_number]
    )

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Registration number already exists" },
        { status: 409 }
      )
    }

    const [result]: any = await db.query(
      `
      INSERT INTO student
      (
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

    return NextResponse.json({
      success: true,
      message: "Student added successfully",
      student_id: result.insertId,
    })
  } catch (error: any) {
    console.error("POST STUDENT ERROR:", error)
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 }
    )
  }
}