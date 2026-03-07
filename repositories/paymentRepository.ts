import { db } from "@/lib/db"

export async function getPayments(){

  const [rows] = await db.query(`
  SELECT p.*, s.first_name,s.last_name
  FROM payment p
  JOIN student s ON p.student_id=s.student_id
  `)

  return rows
}

export async function createPayment(data:any){

  const {student_id,fee_id,amount_paid,payment_method}=data

  const [result]:any = await db.query(
  `INSERT INTO payment
  (student_id,fee_id,amount_paid,payment_method,payment_date)
  VALUES (?,?,?,?,NOW())`,
  [student_id,fee_id,amount_paid,payment_method]
  )

  return result.insertId
}