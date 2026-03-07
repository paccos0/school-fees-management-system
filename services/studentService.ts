import * as repo from "@/repositories/studentRepository"

export async function fetchStudents(){
  return repo.getStudents()
}

export async function fetchStudent(id:number){
  return repo.getStudentById(id)
}

export async function addStudent(data:any){
  return repo.createStudent(data)
}

export async function editStudent(id:number,data:any){
  return repo.updateStudent(id,data)
}

export async function removeStudent(id:number){
  return repo.deleteStudent(id)
}