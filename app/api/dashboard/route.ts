import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    // Example: fetch dashboard stats
    const [students]: any = await db.query("SELECT COUNT(*) as total FROM student")
    const [payments]: any = await db.query("SELECT SUM(amount_paid) as totalPaid FROM payment")
    const [unpaid]: any = await db.query("SELECT COUNT(*) as unpaid FROM student WHERE status='active' AND student_id NOT IN (SELECT student_id FROM payment)")
    const [penalties]: any = await db.query("SELECT SUM(amount) as totalPenalties FROM penalties")

    return NextResponse.json({
      totalStudents: students[0]?.total || 0,
      totalPaid: payments[0]?.totalPaid || 0,
      unpaidStudents: unpaid[0]?.unpaid || 0,
      totalPenalties: penalties[0]?.totalPenalties || 0,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 })
  }
}