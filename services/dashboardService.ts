
import { db } from "@/lib/db"

export async function getDashboardStats(){

  const [[students]]:any = await db.query(
    "SELECT COUNT(*) as total_students FROM student"
  )

  const [[payments]]:any = await db.query(
    "SELECT SUM(amount_paid) as total_collected FROM payment"
  )

  const [[penalties]]:any = await db.query(
    "SELECT SUM(amount) as total_penalties FROM student_penalty"
  )

  return {
    students:students.total_students,
    collected:payments.total_collected || 0,
    penalties:penalties.total_penalties || 0
  }
}