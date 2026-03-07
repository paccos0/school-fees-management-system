import { fetchPayments,addPayment } from "@/services/paymentService"
import { NextResponse } from "next/server"

export async function GET(){
  const payments = await fetchPayments()
  return NextResponse.json(payments)
}

export async function POST(req:Request){

  const data = await req.json()

  const id = await addPayment(data)

  return NextResponse.json({payment_id:id})
}