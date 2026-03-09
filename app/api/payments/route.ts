import { NextResponse } from "next/server"
import { db } from "@/lib/db"

function generateRegistrationNumber(nextId: number) {
  return `STD${String(nextId).padStart(3, "0")}`
}

function generateTransactionReference(nextId: number) {
  return `PAY${String(nextId).padStart(6, "0")}`
}

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
        fs.total_fee,
        t.term_name,
        p.amount_paid,
        p.payment_method,
        p.payment_date,
        p.transaction_reference,
        COALESCE(tp.total_paid, 0) AS total_paid_for_fee,
        (fs.total_fee - COALESCE(tp.total_paid, 0)) AS raw_balance
      FROM payment p
      JOIN student s ON p.student_id = s.student_id
      JOIN class c ON s.class_id = c.class_id
      JOIN fee_structure fs ON p.fee_id = fs.fee_id
      JOIN term t ON fs.term_id = t.term_id
      LEFT JOIN (
        SELECT
          student_id,
          fee_id,
          SUM(amount_paid) AS total_paid
        FROM payment
        GROUP BY student_id, fee_id
      ) tp
        ON tp.student_id = p.student_id
        AND tp.fee_id = p.fee_id
      ORDER BY p.payment_id DESC
    `)

    const formatted = rows.map((row: any) => {
      const rawBalance = Number(row.raw_balance || 0)

      let payment_status = "Full Payment"
      let outstanding_balance = 0
      let credit_amount = 0

      if (rawBalance > 0) {
        payment_status = "Outstanding Balance"
        outstanding_balance = rawBalance
      } else if (rawBalance < 0) {
        payment_status = "Credit"
        credit_amount = Math.abs(rawBalance)
      }

      return {
        ...row,
        payment_status,
        outstanding_balance,
        credit_amount,
      }
    })

    return NextResponse.json(formatted)
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
    let generatedRegistrationNumber: string | null = null

    if (student_mode === "new") {
      if (
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

      const [maxRows]: any = await connection.query(`
        SELECT MAX(student_id) AS maxStudentId
        FROM student
      `)

      const nextStudentId = (maxRows[0]?.maxStudentId || 0) + 1
      generatedRegistrationNumber = generateRegistrationNumber(nextStudentId)

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
          generatedRegistrationNumber,
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

    const [maxPaymentRows]: any = await connection.query(`
      SELECT MAX(payment_id) AS maxPaymentId
      FROM payment
    `)

    const nextPaymentId = (maxPaymentRows[0]?.maxPaymentId || 0) + 1
    const generatedTransactionReference =
      generateTransactionReference(nextPaymentId)

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
        generatedTransactionReference,
      ]
    )

    await connection.commit()

    const message =
      student_mode === "new" && generatedRegistrationNumber
        ? `Payment added successfully. New student registered as ${generatedRegistrationNumber} with reference ${generatedTransactionReference}.`
        : `Payment added successfully with reference ${generatedTransactionReference}.`

    return NextResponse.json({
      success: true,
      message,
      payment_id: paymentResult.insertId,
      student_id: finalStudentId,
      registration_number: generatedRegistrationNumber,
      transaction_reference: generatedTransactionReference,
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