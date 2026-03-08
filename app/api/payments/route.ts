import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT
        p.payment_id,
        p.student_id,
        CONCAT(s.first_name, ' ', s.last_name) AS student_name,
        c.class_name,
        c.section,
        p.fee_id,
        p.amount_paid,
        p.payment_method,
        p.payment_date,
        p.transaction_reference
      FROM payment p
      JOIN student s ON p.student_id = s.student_id
      JOIN class c ON s.class_id = c.class_id
      ORDER BY p.payment_id DESC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error("GET PAYMENTS ERROR:", error)
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()

    const {
      student_mode,
      student_id,
      fee_id,
      amount_paid,
      payment_method,
      payment_date,
      transaction_reference,

      registration_number,
      first_name,
      last_name,
      gender,
      class_id,
      category_id,
      admission_type,
    } = await req.json()

    if (!fee_id || !amount_paid || !payment_method || !payment_date) {
      await connection.rollback()
      return NextResponse.json(
        { error: "Payment fields are required" },
        { status: 400 }
      )
    }

    let finalStudentId = student_id

    if (student_mode === "new") {
      if (
        !registration_number ||
        !first_name ||
        !last_name ||
        !gender ||
        !class_id ||
        !category_id ||
        !admission_type
      ) {
        await connection.rollback()
        return NextResponse.json(
          { error: "All new student fields are required" },
          { status: 400 }
        )
      }

      const [existingStudent]: any = await connection.query(
        `SELECT student_id FROM student WHERE registration_number = ? LIMIT 1`,
        [registration_number]
      )

      if (existingStudent.length > 0) {
        await connection.rollback()
        return NextResponse.json(
          { error: "Registration number already exists" },
          { status: 409 }
        )
      }

      const [studentResult]: any = await connection.query(
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

      finalStudentId = studentResult.insertId
    } else {
      if (!student_id) {
        await connection.rollback()
        return NextResponse.json(
          { error: "Please select an existing student" },
          { status: 400 }
        )
      }
    }

    const [existingReference]: any = await connection.query(
      `SELECT payment_id FROM payment WHERE transaction_reference = ? LIMIT 1`,
      [transaction_reference]
    )

    if (transaction_reference && existingReference.length > 0) {
      await connection.rollback()
      return NextResponse.json(
        { error: "Transaction reference already exists" },
        { status: 409 }
      )
    }

    const [paymentResult]: any = await connection.query(
      `
      INSERT INTO payment
      (
        student_id,
        fee_id,
        amount_paid,
        payment_date,
        payment_method,
        transaction_reference
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        finalStudentId,
        fee_id,
        amount_paid,
        payment_date,
        payment_method,
        transaction_reference || null,
      ]
    )

    await connection.commit()

    return NextResponse.json({
      success: true,
      message: "Payment added successfully",
      payment_id: paymentResult.insertId,
      student_id: finalStudentId,
    })
  } catch (error) {
    await connection.rollback()
    console.error("POST PAYMENT ERROR:", error)
    return NextResponse.json(
      { error: "Failed to add payment" },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
}