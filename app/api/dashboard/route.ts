import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [studentsRows]: any = await db.query(
      `SELECT COUNT(*) AS totalStudents FROM student`
    )

    const [paidRows]: any = await db.query(
      `SELECT COALESCE(SUM(amount_paid), 0) AS totalPaid FROM payment`
    )

    const [unpaidRows]: any = await db.query(`
      SELECT COUNT(DISTINCT student_id) AS unpaidStudents
      FROM student_fee_status
      WHERE balance > 0
    `)

    const [unpaidBalanceRows]: any = await db.query(`
      SELECT COALESCE(SUM(balance), 0) AS totalUnpaidBalance
      FROM student_fee_status
      WHERE balance > 0
    `)

    const [creditRows]: any = await db.query(`
      SELECT COALESCE(SUM(ABS(balance)), 0) AS totalCredit
      FROM student_fee_status
      WHERE balance < 0
    `)

    const [penaltyRows]: any = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS totalPenalties
      FROM student_penalty
      WHERE status = 'unpaid'
    `)

    const [classDebtRows]: any = await db.query(`
      SELECT
        class_name,
        COUNT(DISTINCT student_id) AS unpaidStudents,
        COALESCE(SUM(balance), 0) AS unpaidBalance
      FROM student_fee_status
      WHERE balance > 0
      GROUP BY class_name
      ORDER BY unpaidBalance DESC, class_name ASC
    `)

    const [termDebtRows]: any = await db.query(`
      SELECT
        year_name,
        term_name,
        COUNT(DISTINCT CASE WHEN balance > 0 THEN student_id END) AS unpaidStudents,
        COALESCE(SUM(total_fee), 0) AS expectedFees,
        COALESCE(SUM(total_paid), 0) AS collectedFees,
        COALESCE(SUM(balance), 0) AS unpaidBalance
      FROM student_fee_status
      GROUP BY year_name, term_name
      ORDER BY year_name DESC, term_name ASC
    `)

    return NextResponse.json({
      totalStudents: studentsRows[0]?.totalStudents || 0,
      totalPaid: paidRows[0]?.totalPaid || 0,
      unpaidStudents: unpaidRows[0]?.unpaidStudents || 0,
      totalUnpaidBalance: unpaidBalanceRows[0]?.totalUnpaidBalance || 0,
      totalCredit: creditRows[0]?.totalCredit || 0,
      totalPenalties: penaltyRows[0]?.totalPenalties || 0,
      classDebts: classDebtRows || [],
      termSummaries: termDebtRows || [],
    })
  } catch (error) {
    console.error("DASHBOARD API ERROR:", error)

    return NextResponse.json(
      {
        totalStudents: 0,
        totalPaid: 0,
        unpaidStudents: 0,
        totalUnpaidBalance: 0,
        totalCredit: 0,
        totalPenalties: 0,
        classDebts: [],
        termSummaries: [],
      },
      { status: 500 }
    )
  }
}