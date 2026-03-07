import { db } from "@/lib/db"

export async function getFees(){

  const [rows] = await db.query(`
  SELECT fs.*, c.class_name, t.term_name
  FROM fee_structure fs
  JOIN class c ON fs.class_id=c.class_id
  JOIN term t ON fs.term_id=t.term_id
  `)

  return rows
}

export async function createFee(data:any){

  const {class_id,term_id,total_fee}=data

  const [result]:any = await db.query(
    `INSERT INTO fee_structure
    (class_id,term_id,total_fee)
    VALUES (?,?,?)`,
    [class_id,term_id,total_fee]
  )

  return result.insertId
}