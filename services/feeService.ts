import * as repo from "@/repositories/feeRepository"

export async function fetchFees(){
  return repo.getFees()
}

export async function addFee(data:any){
  return repo.createFee(data)
}