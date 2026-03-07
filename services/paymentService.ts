import * as repo from "@/repositories/paymentRepository"

export async function fetchPayments(){
  return repo.getPayments()
}

export async function addPayment(data:any){
  return repo.createPayment(data)
}