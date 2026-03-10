"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { toast } from "sonner"

type ClassItem = {
  class_id: number
  class_name: string
  section: string | null
}

type TermItem = {
  term_id: number
  term_name: string
}

type CategoryItem = {
  category_id: number
  category_name: string
}

type FeeStructure = {
  fee_id: number
  scope_type: "class" | "general"
  class_id: number | null
  class_name?: string
  section?: string | null
  term_id: number
  term_name: string
  category_id: number
  category_name: string
  admission_type: "new" | "continuing"
  total_fee: number
  scope_label?: string
}

export default function FeesPage() {
  const [fees, setFees] = useState<FeeStructure[]>([])
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [terms, setTerms] = useState<TermItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    scope_type: "class",
    class_id: "",
    term_id: "",
    category_id: "",
    admission_type: "new",
    total_fee: "",
  })

  useEffect(() => {
    fetchFees()
    fetchClasses()
    fetchTerms()
    fetchCategories()
  }, [])

  const fetchFees = async () => {
    try {
      const res = await api.get("/fees")
      setFees(res.data)
    } catch (error) {
      console.error("Failed to fetch fees:", error)
      toast.error("Failed to fetch fees")
    }
  }

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes")
      setClasses(res.data)
    } catch (error) {
      console.error("Failed to fetch classes:", error)
      toast.error("Failed to fetch classes")
    }
  }

  const fetchTerms = async () => {
    try {
      const res = await api.get("/terms")
      setTerms(res.data)
    } catch (error) {
      console.error("Failed to fetch terms:", error)
      toast.error("Failed to fetch terms")
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await api.get("/student-categories")
      setCategories(res.data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      toast.error("Failed to fetch categories")
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === "scope_type") {
      setFormData((prev) => ({
        ...prev,
        scope_type: value,
        class_id: value === "general" ? "" : prev.class_id,
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      scope_type: "class",
      class_id: "",
      term_id: "",
      category_id: "",
      admission_type: "new",
      total_fee: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload: any = {
        scope_type: formData.scope_type,
        term_id: Number(formData.term_id),
        category_id: Number(formData.category_id),
        admission_type: formData.admission_type,
        total_fee: Number(formData.total_fee),
      }

      if (formData.scope_type === "class") {
        payload.class_id = Number(formData.class_id)
      }

      await api.post("/fees", payload)
      toast.success("Fee structure added successfully")
      resetForm()
      fetchFees()
    } catch (error: any) {
      console.error("Failed to add fee structure:", error)
      toast.error(
        error?.response?.data?.error || "Failed to add fee structure"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">Fee Structures</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Scope Type</label>
            <select
              name="scope_type"
              value={formData.scope_type}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none"
            >
              <option value="class">Class-based</option>
              <option value="general">General</option>
            </select>
          </div>

          {formData.scope_type === "class" && (
            <div>
              <label className="mb-1 block text-sm font-medium">Class</label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                className="w-full rounded-xl border p-3 outline-none"
                required
              >
                <option value="">Select class</option>
                {classes.map((item) => (
                  <option key={item.class_id} value={item.class_id}>
                    {item.class_name} {item.section || ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Term</label>
            <select
              name="term_id"
              value={formData.term_id}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none"
              required
            >
              <option value="">Select term</option>
              {terms.map((item) => (
                <option key={item.term_id} value={item.term_id}>
                  {item.term_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Student Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none"
              required
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item.category_id} value={item.category_id}>
                  {item.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Admission Type</label>
            <select
              name="admission_type"
              value={formData.admission_type}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none"
              required
            >
              <option value="new">New</option>
              <option value="continuing">Continuing</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Total Fee</label>
            <input
              type="number"
              name="total_fee"
              value={formData.total_fee}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none"
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Add Fee Structure"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">All Fee Structures</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Scope</th>
                <th className="p-3">Target</th>
                <th className="p-3">Term</th>
                <th className="p-3">Category</th>
                <th className="p-3">Admission</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee.fee_id} className="border-b">
                  <td className="p-3 capitalize">{fee.scope_type}</td>
                  <td className="p-3">
                    {fee.scope_type === "general"
                      ? "General"
                      : `${fee.class_name || ""} ${fee.section || ""}`.trim()}
                  </td>
                  <td className="p-3">{fee.term_name}</td>
                  <td className="p-3">{fee.category_name}</td>
                  <td className="p-3 capitalize">{fee.admission_type}</td>
                  <td className="p-3 font-medium">
                    RWF {Number(fee.total_fee).toLocaleString()}
                  </td>
                </tr>
              ))}
              {fees.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No fee structures found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}