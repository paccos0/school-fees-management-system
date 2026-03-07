import { fetchStudent,editStudent,removeStudent } from "@/services/studentService"
import { NextResponse } from "next/server"

export async function GET(_:Request,{params}:{params:{id:string}}){

  const student = await fetchStudent(Number(params.id))

  return NextResponse.json(student)
}

export async function PUT(req:Request,{params}:{params:{id:string}}){

  const data = await req.json()

  await editStudent(Number(params.id),data)

  return NextResponse.json({success:true})
}

export async function DELETE(_:Request,{params}:{params:{id:string}}){

  await removeStudent(Number(params.id))

  return NextResponse.json({success:true})
}