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
    <div className="page-overlay min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-fixed p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="glass rounded-3xl p-6 md:p-8">
          <div className="mb-6">
            <h1 className="glass-title text-2xl font-bold md:text-3xl">
              Fee Structures
            </h1>
            <p className="glass-muted mt-1 text-sm">
              Manage class-based and general fee structures for each term.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <div>
              <label className="glass-text mb-2 block text-sm font-medium">
                Scope Type
              </label>
              <select
                name="scope_type"
                value={formData.scope_type}
                onChange={handleChange}
                className="glass-input w-full rounded-2xl px-4 py-3"
              >
                <option value="class" className="text-black">
                  Class-based
                </option>
                <option value="general" className="text-black">
                  General
                </option>
              </select>
            </div>

            {formData.scope_type === "class" && (
              <div>
                <label className="glass-text mb-2 block text-sm font-medium">
                  Class
                </label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                  className="glass-input w-full rounded-2xl px-4 py-3"
                  required
                >
                  <option value="" className="text-black">
                    Select class
                  </option>
                  {classes.map((item) => (
                    <option
                      key={item.class_id}
                      value={item.class_id}
                      className="text-black"
                    >
                      {item.class_name} {item.section || ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="glass-text mb-2 block text-sm font-medium">
                Term
              </label>
              <select
                name="term_id"
                value={formData.term_id}
                onChange={handleChange}
                className="glass-input w-full rounded-2xl px-4 py-3"
                required
              >
                <option value="" className="text-black">
                  Select term
                </option>
                {terms.map((item) => (
                  <option
                    key={item.term_id}
                    value={item.term_id}
                    className="text-black"
                  >
                    {item.term_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="glass-text mb-2 block text-sm font-medium">
                Student Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="glass-input w-full rounded-2xl px-4 py-3"
                required
              >
                <option value="" className="text-black">
                  Select category
                </option>
                {categories.map((item) => (
                  <option
                    key={item.category_id}
                    value={item.category_id}
                    className="text-black"
                  >
                    {item.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="glass-text mb-2 block text-sm font-medium">
                Admission Type
              </label>
              <select
                name="admission_type"
                value={formData.admission_type}
                onChange={handleChange}
                className="glass-input w-full rounded-2xl px-4 py-3"
                required
              >
                <option value="new" className="text-black">
                  New
                </option>
                <option value="continuing" className="text-black">
                  Continuing
                </option>
              </select>
            </div>

            <div>
              <label className="glass-text mb-2 block text-sm font-medium">
                Total Fee
              </label>
              <input
                type="number"
                name="total_fee"
                value={formData.total_fee}
                onChange={handleChange}
                className="glass-input w-full rounded-2xl px-4 py-3"
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="glass-button rounded-2xl px-6 py-3 font-semibold"
              >
                {loading ? "Saving..." : "Add Fee Structure"}
              </button>
            </div>
          </form>
        </div>

        <div className="glass rounded-3xl p-6 md:p-8">
          <div className="mb-6">
            <h2 className="glass-title text-xl font-semibold md:text-2xl">
              All Fee Structures
            </h2>
            <p className="glass-muted mt-1 text-sm">
              View all registered class-based and general fee structures.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl glass-table">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="p-4">Scope</th>
                  <th className="p-4">Target</th>
                  <th className="p-4">Term</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Admission</th>
                  <th className="p-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => (
                  <tr key={fee.fee_id}>
                    <td className="p-4 capitalize">
                      <span className="glass-text">{fee.scope_type}</span>
                    </td>
                    <td className="p-4">
                      <span className="glass-text">
                        {fee.scope_type === "general"
                          ? "General"
                          : `${fee.class_name || ""} ${fee.section || ""}`.trim()}
                      </span>
                    </td>
                    <td className="p-4">{fee.term_name}</td>
                    <td className="p-4">{fee.category_name}</td>
                    <td className="p-4 capitalize">{fee.admission_type}</td>
                    <td className="p-4">
                      <span className="glass-title font-semibold">
                        RWF {Number(fee.total_fee).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}

                {fees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="glass-muted p-8 text-center">
                      No fee structures found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}