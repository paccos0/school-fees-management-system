"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/api"
import DataTable from "@/components/DataTable"

export default function FeesPage() {
  const [fees, setFees] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [terms, setTerms] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [editingFee, setEditingFee] = useState<any | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState({
    class_id: "",
    term_id: "",
    category_id: "",
    admission_type: "",
    total_fee: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [feesRes, classesRes, termsRes, categoriesRes] = await Promise.all([
        api.get("/fees"),
        api.get("/classes"),
        api.get("/terms"),
        api.get("/student-categories"),
      ])

      setFees(feesRes.data)
      setClasses(classesRes.data)
      setTerms(termsRes.data)
      setCategories(categoriesRes.data)
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.error || "Failed to load fees data")
    }
  }

  const resetForm = () => {
    setFormData({
      class_id: "",
      term_id: "",
      category_id: "",
      admission_type: "",
      total_fee: "",
    })
  }

  const handleAddFee = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await api.post("/fees", {
        ...formData,
        class_id: Number(formData.class_id),
        term_id: Number(formData.term_id),
        category_id: Number(formData.category_id),
        total_fee: Number(formData.total_fee),
      })

      toast.success("Fee structure added successfully")
      setShowAddModal(false)
      resetForm()
      loadData()
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.error || "Failed to add fee structure")
    }
  }

  const handleEditClick = (fee: any) => {
    setEditingFee(fee)
    setFormData({
      class_id: String(fee.class_id),
      term_id: String(fee.term_id),
      category_id: String(fee.category_id),
      admission_type: fee.admission_type,
      total_fee: String(fee.total_fee),
    })
  }

  const handleUpdateFee = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingFee) return

    try {
      await api.put(`/fees/${editingFee.fee_id}`, {
        ...formData,
        class_id: Number(formData.class_id),
        term_id: Number(formData.term_id),
        category_id: Number(formData.category_id),
        total_fee: Number(formData.total_fee),
      })

      toast.success("Fee structure updated successfully")
      setEditingFee(null)
      resetForm()
      loadData()
    } catch (error: any) {
      console.error(error)
      toast.error(
        error?.response?.data?.error || "Failed to update fee structure"
      )
    }
  }

  const filteredFees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) return fees

    return fees.filter((fee) => {
      return (
        String(fee.fee_id).toLowerCase().includes(query) ||
        String(fee.class_name || "").toLowerCase().includes(query) ||
        String(fee.section || "").toLowerCase().includes(query) ||
        String(fee.term_name || "").toLowerCase().includes(query) ||
        String(fee.category_name || "").toLowerCase().includes(query) ||
        String(fee.admission_type || "").toLowerCase().includes(query) ||
        String(fee.total_fee || "").toLowerCase().includes(query)
      )
    })
  }, [fees, searchTerm])

  const tableData = filteredFees.map((fee) => ({
    ...fee,
    class_display: `${fee.class_name} ${fee.section || ""}`.trim(),
    total_fee_display: `RWF ${Number(fee.total_fee).toLocaleString()}`,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fees</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage fee structures by class, term, category, and admission type.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm()
            setEditingFee(null)
            setShowAddModal(true)
          }}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add Fee Structure
        </button>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <input
          type="text"
          placeholder="Search by class, term, category, admission type, amount..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <DataTable
        columns={[
          { header: "ID", accessor: "fee_id" },
          { header: "Class", accessor: "class_display" },
          { header: "Term", accessor: "term_name" },
          { header: "Category", accessor: "category_name" },
          { header: "Admission", accessor: "admission_type" },
          { header: "Total Fee", accessor: "total_fee_display" },
        ]}
        data={tableData}
        rowKey="fee_id"
        actions={(row) => (
          <button
            onClick={() => handleEditClick(row)}
            className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
          >
            Edit
          </button>
        )}
      />

      {(showAddModal || editingFee) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              {editingFee ? "Edit Fee Structure" : "Add Fee Structure"}
            </h2>

            <form
              onSubmit={editingFee ? handleUpdateFee : handleAddFee}
              className="mt-5 space-y-4"
            >
              <select
                value={formData.class_id}
                onChange={(e) =>
                  setFormData({ ...formData, class_id: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              >
                <option value="">Select class</option>
                {classes.map((item: any) => (
                  <option key={item.class_id} value={item.class_id}>
                    {item.class_name} {item.section}
                  </option>
                ))}
              </select>

              <select
                value={formData.term_id}
                onChange={(e) =>
                  setFormData({ ...formData, term_id: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              >
                <option value="">Select term</option>
                {terms.map((item: any) => (
                  <option key={item.term_id} value={item.term_id}>
                    {item.term_name}
                  </option>
                ))}
              </select>

              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              >
                <option value="">Select category</option>
                {categories.map((item: any) => (
                  <option key={item.category_id} value={item.category_id}>
                    {item.category_name}
                  </option>
                ))}
              </select>

              <select
                value={formData.admission_type}
                onChange={(e) =>
                  setFormData({ ...formData, admission_type: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              >
                <option value="">Select admission type</option>
                <option value="new">New</option>
                <option value="continuing">Continuing</option>
              </select>

              <input
                type="number"
                placeholder="Total Fee"
                value={formData.total_fee}
                onChange={(e) =>
                  setFormData({ ...formData, total_fee: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingFee(null)
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
                  {editingFee ? "Save Changes" : "Add Fee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}