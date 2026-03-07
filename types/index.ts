export interface Student{
  student_id:number
  registration_number:string
  first_name:string
  last_name:string
  gender:string
  class_id:number
}

export interface Payment{
  payment_id:number
  student_id:number
  fee_id:number
  amount_paid:number
}

export interface Fee{
  fee_id:number
  class_id:number
  term_id:number
  total_fee:number
}