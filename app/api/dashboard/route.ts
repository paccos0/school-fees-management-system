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

    const [unpaidRows]: any = await db.query(
      `
      SELECT COUNT(*) AS unpaidStudents
      FROM student
      WHERE student_id NOT IN (
        SELECT DISTINCT student_id FROM payment
      )
      `
    )

    const [penaltyRows]: any = await db.query(
      `SELECT COALESCE(SUM(amount), 0) AS totalPenalties
       FROM student_penalty`
    )

    return NextResponse.json({
      totalStudents: studentsRows[0]?.totalStudents || 0,
      totalPaid: paidRows[0]?.totalPaid || 0,
      unpaidStudents: unpaidRows[0]?.unpaidStudents || 0,
      totalPenalties: penaltyRows[0]?.totalPenalties || 0,
    })
  } catch (error) {
    console.error("DASHBOARD API ERROR:", error)

    return NextResponse.json(
      {
        totalStudents: 0,
        totalPaid: 0,
        unpaidStudents: 0,
        totalPenalties: 0,
      },
      { status: 500 }
    )
  }
}