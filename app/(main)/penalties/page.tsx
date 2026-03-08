"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/api"
import DataTable from "@/components/DataTable"

export default function PenaltiesPage() {
  const [penalties, setPenalties] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [penaltyTypes, setPenaltyTypes] = useState<any[]>([])
  const [editingPenalty, setEditingPenalty] = useState<any | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState({
    student_id: "",
    penalty_type_id: "",
    amount: "",
    description: "",
    issued_date: "",
    status: "unpaid",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [penaltiesRes, studentsRes, typesRes] = await Promise.all([
        api.get("/penalties"),
        api.get("/students"),
        api.get("/penalty-types"),
      ])

      setPenalties(penaltiesRes.data)
      setStudents(studentsRes.data)
      setPenaltyTypes(typesRes.data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load penalties data")
    }
  }

  const resetForm = () => {
    setFormData({
      student_id: "",
      penalty_type_id: "",
      amount: "",
      description: "",
      issued_date: "",
      status: "unpaid",
    })
  }

  const handleAddPenalty = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await api.post("/penalties", {
        ...formData,
        amount: Number(formData.amount),
        student_id: Number(formData.student_id),
        penalty_type_id: Number(formData.penalty_type_id),
      })

      toast.success("Penalty added successfully")
      setShowAddModal(false)
      resetForm()
      loadData()
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.error || "Failed to add penalty")
    }
  }

  const handleEditClick = (penalty: any) => {
    setEditingPenalty(penalty)
    setFormData({
      student_id: String(penalty.student_id),
      penalty_type_id: String(penalty.penalty_type_id || ""),
      amount: String(penalty.amount),
      description: penalty.description || "",
      issued_date: penalty.issued_date,
      status: penalty.status,
    })
  }

  const handleUpdatePenalty = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingPenalty) return

    try {
      await api.put(`/penalties/${editingPenalty.student_penalty_id}`, {
        ...formData,
        amount: Number(formData.amount),
        student_id: Number(formData.student_id),
        penalty_type_id: Number(formData.penalty_type_id),
      })

      toast.success("Penalty updated successfully")
      setEditingPenalty(null)
      resetForm()
      loadData()
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.error || "Failed to update penalty")
    }
  }

  const togglePenaltyStatus = (penalty: any) => {
    const nextStatus = penalty.status === "paid" ? "unpaid" : "paid"

    toast(`Mark this penalty as ${nextStatus}?`, {
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await api.put(`/penalties/${penalty.student_penalty_id}`, {
              student_id: penalty.student_id,
              penalty_type_id: penalty.penalty_type_id,
              amount: Number(penalty.amount),
              description: penalty.description,
              issued_date: penalty.issued_date,
              status: nextStatus,
            })

            toast.success(`Penalty marked as ${nextStatus}`)
            loadData()
          } catch (error: any) {
            console.error(error)
            toast.error(
              error?.response?.data?.error || "Failed to update penalty status"
            )
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => { },
      },
    })
  }

  const filteredPenalties = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) return penalties

    return penalties.filter((penalty) => {
      return (
        String(penalty.student_penalty_id).toLowerCase().includes(query) ||
        String(penalty.student_name || "").toLowerCase().includes(query) ||
        String(penalty.penalty_name || "").toLowerCase().includes(query) ||
        String(penalty.description || "").toLowerCase().includes(query) ||
        String(penalty.status || "").toLowerCase().includes(query) ||
        String(penalty.issued_date || "").toLowerCase().includes(query) ||
        String(penalty.amount || "").toLowerCase().includes(query)
      )
    })
  }, [penalties, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Penalties</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage damage-related and disciplinary penalties.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm()
            setEditingPenalty(null)
            setShowAddModal(true)
          }}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add Penalty
        </button>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <input
          type="text"
          placeholder="Search by student, penalty, description, status, date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <DataTable
        columns={[
          { header: "ID", accessor: "student_penalty_id" },
          { header: "Student", accessor: "student_name" },
          { header: "Penalty", accessor: "penalty_name" },
          { header: "Amount", accessor: "amount" },
          { header: "Description", accessor: "description" },
          { header: "Issued Date", accessor: "issued_date" },
          { header: "Status", accessor: "status" },
        ]}
        data={filteredPenalties}
        rowKey="student_penalty_id"
        actions={(row) => (
          <>
            <button
              onClick={() => handleEditClick(row)}
              className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            >
              Edit
            </button>

            <button
              onClick={() => togglePenaltyStatus(row)}
              className={`rounded-lg px-3 py-1 text-white ${row.status === "paid"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {row.status === "paid" ? "Mark Unpaid" : "Mark Paid"}
            </button>
          </>
        )}
      />

      {(showAddModal || editingPenalty) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              {editingPenalty ? "Edit Penalty" : "Add Penalty"}
            </h2>

            <form
              onSubmit={editingPenalty ? handleUpdatePenalty : handleAddPenalty}
              className="mt-5 space-y-4"
            >
              <select
                value={formData.student_id}
                onChange={(e) =>
                  setFormData({ ...formData, student_id: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              >
                <option value="">Select student</option>
                {students.map((student: any) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>

              <select
                value={formData.penalty_type_id}
                onChange={(e) => {
                  const selectedId = e.target.value
                  const selectedType = penaltyTypes.find(
                    (type: any) => String(type.penalty_type_id) === selectedId
                  )

                  setFormData({
                    ...formData,
                    penalty_type_id: selectedId,
                    amount: selectedType
                      ? String(selectedType.default_amount)
                      : formData.amount,
                  })
                }}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              >
                <option value="">Select penalty type</option>
                {penaltyTypes.map((type: any) => (
                  <option key={type.penalty_type_id} value={type.penalty_type_id}>
                    {type.penalty_name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                rows={4}
              />

              <input
                type="date"
                value={formData.issued_date}
                onChange={(e) =>
                  setFormData({ ...formData, issued_date: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingPenalty(null)
                    resetForm()
                  }}
                  className="rounded-xl bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  {editingPenalty ? "Save Changes" : "Add Penalty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}