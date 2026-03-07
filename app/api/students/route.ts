import { fetchStudents,addStudent } from "@/services/studentService"
import { NextResponse } from "next/server"

export async function GET(){
  const students = await fetchStudents()
  return NextResponse.json(students)
}

export async function POST(req:Request){

  const data = await req.json()

  const id = await addStudent(data)

  return NextResponse.json({student_id:id})
}