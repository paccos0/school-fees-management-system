import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT
        sp.student_penalty_id,
        sp.student_id,
        sp.penalty_type_id,
        CONCAT(s.first_name, ' ', s.last_name) AS student_name,
        pt.penalty_name,
        sp.amount,
        sp.description,
        sp.issued_date,
        sp.status
      FROM student_penalty sp
      INNER JOIN student s ON sp.student_id = s.student_id
      INNER JOIN penalty_type pt ON sp.penalty_type_id = pt.penalty_type_id
      ORDER BY sp.student_penalty_id DESC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error("GET PENALTIES ERROR:", error)
    return NextResponse.json(
      { error: "Failed to fetch penalties" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const {
      student_id,
      penalty_type_id,
      amount,
      description,
      issued_date,
      status,
    } = await req.json()

    if (!student_id || !penalty_type_id || !amount || !issued_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const [result]: any = await db.query(
      `
      INSERT INTO student_penalty
      (student_id, penalty_type_id, amount, description, issued_date, status)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        student_id,
        penalty_type_id,
        amount,
        description || null,
        issued_date,
        status || "unpaid",
      ]
    )

    return NextResponse.json({
      success: true,
      message: "Penalty added successfully",
      student_penalty_id: result.insertId,
    })
  } catch (error) {
    console.error("POST PENALTY ERROR:", error)
    return NextResponse.json(
      { error: "Failed to add penalty" },
      { status: 500 }
    )
  }
}