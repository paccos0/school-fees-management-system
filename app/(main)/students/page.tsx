"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import DataTable from "@/components/DataTable"
import { toast } from "sonner"

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [editingStudent, setEditingStudent] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    registration_number: "",
    first_name: "",
    last_name: "",
    gender: "",
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students")
      setStudents(res.data)
    } catch (error) {
      console.error("Failed to fetch students:", error)
      toast.error("Failed to fetch students")
    }
  }

  const handleEditClick = (student: any) => {
    setEditingStudent(student)
    setFormData({
      registration_number: student.registration_number || "",
      first_name: student.first_name || "",
      last_name: student.last_name || "",
      gender: student.gender || "",
    })
  }

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingStudent) return

    try {
      await api.put(`/students/${editingStudent.student_id}`, formData)
      toast.success("Student updated successfully")
      setEditingStudent(null)
      fetchStudents()
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.error || "Failed to update student")
    }
  }

  const handleDeactivateStudent = (studentId: number) => {
    toast("Deactivate this student?", {
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await api.put(`/students/${studentId}/deactivate`)
            toast.success("Student deactivated successfully")
            fetchStudents()
          } catch (error: any) {
            console.error(error)
            toast.error(
              error?.response?.data?.error || "Failed to deactivate student"
            )
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    })
  }

  const handleActivateStudent = async (studentId: number) => {
    try {
      await api.put(`/students/${studentId}/activate`)
      toast.success("Student activated successfully")
      fetchStudents()
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.error || "Failed to activate student")
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
        <h1 className="text-2xl font-bold text-white">Students</h1>
        <p className="mt-2 text-sm text-slate-300">
          View, edit, and manage registered students safely.
        </p>
      </div>

      <DataTable
        columns={[
          { header: "Student ID", accessor: "student_id" },
          { header: "Reg Number", accessor: "registration_number" },
          { header: "First Name", accessor: "first_name" },
          { header: "Last Name", accessor: "last_name" },
          { header: "Gender", accessor: "gender" },
          { header: "Status", accessor: "status" },
        ]}
        data={students}
        actions={(row) => (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleEditClick(row)}
              className="rounded-xl border border-cyan-300/30 bg-cyan-500/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-cyan-600"
            >
              Edit
            </button>

            {row.status === "active" ? (
              <button
                onClick={() => handleDeactivateStudent(row.student_id)}
                className="rounded-xl border border-red-300/30 bg-red-500/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Deactivate
              </button>
            ) : (
              <button
                onClick={() => handleActivateStudent(row.student_id)}
                className="rounded-xl border border-emerald-300/30 bg-emerald-500/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                Activate
              </button>
            )}
          </div>
        )}
      />

      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-slate-950/55 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <h2 className="text-xl font-bold text-white">Edit Student</h2>

            <form onSubmit={handleUpdateStudent} className="mt-5 space-y-4">
              <input
                type="text"
                placeholder="Registration Number"
                value={formData.registration_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registration_number: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-white/20 bg-white/85 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-cyan-500"
                required
              />

              <input
                type="text"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    first_name: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-white/20 bg-white/85 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-cyan-500"
                required
              />

              <input
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    last_name: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-white/20 bg-white/85 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-cyan-500"
                required
              />

              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-white/20 bg-white/85 px-4 py-3 text-gray-900 outline-none transition focus:border-cyan-500"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-slate-100 transition hover:bg-white/15"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl border border-cyan-300/30 bg-cyan-500/90 px-4 py-2 text-white transition hover:bg-cyan-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}