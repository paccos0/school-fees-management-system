"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import DataTable from "@/components/DataTable"

export default function StudentsPage() {

  const [students, setStudents] = useState([])

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const res = await api.get("/students")
    setStudents(res.data)
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl mb-4">Students</h1>

      <DataTable
        columns={[
          "Reg Number",
          "First Name",
          "Last Name",
          "Gender",
        ]}
        data={students}
      />

    </div>
  )
}