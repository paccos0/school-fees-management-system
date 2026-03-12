"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { toast } from "sonner"

type ClassItem = {
  class_id: number
  class_name: string
  section: string | null
}

type CategoryItem = {
  category_id: number
  category_name: string
}

type FeeItem = {
  fee_id: number
  class_id: number
  class_name: string
  section: string | null
  category_id: number
  category_name: string
  admission_type: "new" | "continuing"
  total_fee: number
}

export default function NewStudentPage() {
  const router = useRouter()

  const [classes, setClasses] = useState<ClassItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [fees, setFees] = useState<FeeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMeta, setLoadingMeta] = useState(true)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    class_id: "",
    category_id: "",
    admission_type: "continuing",
  })

  useEffect(() => {
    loadMeta()
  }, [])

  const loadMeta = async () => {
    try {
      setLoadingMeta(true)

      const [classesRes, categoriesRes, feesRes] = await Promise.all([
        api.get("/classes"),
        api.get("/student-categories"),
        api.get("/fees"),
      ])

      setClasses(classesRes.data || [])
      setCategories(categoriesRes.data || [])
      setFees(feesRes.data || [])
    } catch (error) {
      console.error("Failed to load student form data:", error)
      toast.error("Failed to load form data")
    } finally {
      setLoadingMeta(false)
    }
  }

  const matchedFee = useMemo(() => {
    if (!formData.class_id || !formData.category_id || !formData.admission_type) {
      return null
    }

    return (
      fees.find(
        (fee) =>
          String(fee.class_id) === String(formData.class_id) &&
          String(fee.category_id) === String(formData.category_id) &&
          String(fee.admission_type) === String(formData.admission_type)
      ) || null
    )
  }, [fees, formData.class_id, formData.category_id, formData.admission_type])

  const selectedClass = useMemo(() => {
    return classes.find((item) => String(item.class_id) === formData.class_id)
  }, [classes, formData.class_id])

  const selectedCategory = useMemo(() => {
    return categories.find(
      (item) => String(item.category_id) === formData.category_id
    )
  }, [categories, formData.category_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.gender ||
      !formData.class_id ||
      !formData.category_id ||
      !formData.admission_type
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)

      const res = await api.post("/students", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        class_id: Number(formData.class_id),
        category_id: Number(formData.category_id),
        admission_type: formData.admission_type,
      })

      toast.success(res.data?.message || "Student added successfully")
      router.push("/students")
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.error || "Failed to add student")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="glass rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="glass-title text-2xl font-bold md:text-3xl">
              Add New Student
            </h1>
            <p className="glass-muted mt-1 text-sm">
              Create a student record and assign class, category, and admission type.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/students")}
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
          >
            <ArrowLeft size={16} />
            Back to Students
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-8">
        {loadingMeta ? (
          <div className="glass-muted text-sm">Loading form data...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-5">
              <div>
                <label className="glass-muted mb-2 block text-sm">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                  placeholder="Enter first name"
                  className="glass-input w-full rounded-2xl px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="glass-muted mb-2 block text-sm">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      last_name: e.target.value,
                    }))
                  }
                  placeholder="Enter last name"
                  className="glass-input w-full rounded-2xl px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="glass-muted mb-2 block text-sm">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  className="glass-input w-full rounded-2xl px-4 py-3"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="glass-muted mb-2 block text-sm">Class</label>
                <select
                  value={formData.class_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      class_id: e.target.value,
                    }))
                  }
                  className="glass-input w-full rounded-2xl px-4 py-3"
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

              <div>
                <label className="glass-muted mb-2 block text-sm">
                  Student Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category_id: e.target.value,
                    }))
                  }
                  className="glass-input w-full rounded-2xl px-4 py-3"
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
                <label className="glass-muted mb-2 block text-sm">
                  Admission Type
                </label>
                <select
                  value={formData.admission_type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      admission_type: e.target.value as "new" | "continuing",
                    }))
                  }
                  className="glass-input w-full rounded-2xl px-4 py-3"
                  required
                >
                  <option value="continuing">Continuing</option>
                  <option value="new">New</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="glass-title text-sm font-semibold">Preview</p>
          <div className="mt-3 space-y-2 text-sm">
            <p className="glass-muted">
              Registration Number:{" "}
              <span className="glass-title font-medium">
                Auto-generated when saved
              </span>
            </p>
            <p className="glass-muted">
              Class:{" "}
              <span className="glass-title font-medium">
                {selectedClass
                  ? `${selectedClass.class_name} ${selectedClass.section || ""}`
                  : "-"}
              </span>
            </p>
            <p className="glass-muted">
              Category:{" "}
              <span className="glass-title font-medium">
                {selectedCategory?.category_name || "-"}
              </span>
            </p>
            <p className="glass-muted">
              Admission Type:{" "}
              <span className="glass-title font-medium capitalize">
                {formData.admission_type || "-"}
              </span>
            </p>
            <p className="glass-muted">
              Matching Fee Structure:{" "}
              <span className="glass-title font-medium">
                {matchedFee
                  ? `RWF ${Number(matchedFee.total_fee).toLocaleString()}`
                  : "No matching fee structure found"}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/students")}
            className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || loadingMeta}
            className="glass-button flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save size={16} />
            {loading ? "Saving..." : "Save Student"}
          </button>
        </div>
      </form>
    </div>
  )
}