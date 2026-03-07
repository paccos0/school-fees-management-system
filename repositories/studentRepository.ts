import { db } from "@/lib/db"

export async function getStudents(){
  const [rows] = await db.query(`
  SELECT s.*, c.class_name
  FROM student s
  JOIN class c ON s.class_id=c.class_id
  `)

  return rows
}

export async function getStudentById(id:number){
  const [rows]:any = await db.query(
    "SELECT * FROM student WHERE student_id=?",
    [id]
  )

  return rows[0]
}

export async function createStudent(data:any){

  const {registration_number,first_name,last_name,gender,class_id}=data

  const [result]:any = await db.query(
    `INSERT INTO student
    (registration_number,first_name,last_name,gender,class_id)
    VALUES (?,?,?,?,?)`,
    [registration_number,first_name,last_name,gender,class_id]
  )

  return result.insertId
}

export async function updateStudent(id:number,data:any){

  const {first_name,last_name,class_id}=data

  await db.query(
    `UPDATE student
     SET first_name=?,last_name=?,class_id=?
     WHERE student_id=?`,
     [first_name,last_name,class_id,id]
  )
}

export async function deleteStudent(id:number){
  await db.query(
    "DELETE FROM student WHERE student_id=?",
    [id]
  )
}