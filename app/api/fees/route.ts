import { fetchFees,addFee } from "@/services/feeService"
import { NextResponse } from "next/server"

export async function GET(){

  const fees = await fetchFees()

  return NextResponse.json(fees)
}

export async function POST(req:Request){

  const data = await req.json()

  const id = await addFee(data)

  return NextResponse.json({fee_id:id})
}