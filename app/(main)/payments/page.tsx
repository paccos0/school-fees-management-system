"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { toast } from "sonner"

type StudentItem = {
  student_id: number
  registration_number: string
  first_name: string
  last_name: string
  class_id: number
  class_name?: string
  section?: string | null
  category_id: number
  category_name?: string
  admission_type: "new" | "continuing"
}

type ClassItem = {
  class_id: number
  class_name: string
  section: string | null
}

type CategoryItem = {
  category_id: number
  category_name: string
}

type ApplicableFee = {
  fee_id: number
  scope_type: "class" | "general"
  class_id: number | null
  term_id: number
  term_name: string
  category_id: number
  category_name: string
  admission_type: "new" | "continuing"
  total_fee: number
  class_name?: string
  section?: string | null
  scope_label?: string
}

export default function PaymentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([])
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [applicableFees, setApplicableFees] = useState<ApplicableFee[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    student_mode: "existing",
    student_id: "",
    fee_id: "",
    amount_paid: "",
    payment_method: "",
    payment_date: "",

    first_name: "",
    last_name: "",
    gender: "",
    class_id: "",
    category_id: "",
    admission_type: "new",
  })

  useEffect(() => {
    fetchStudents()
    fetchClasses()
    fetchCategories()
    fetchPayments()
  }, [])

  useEffect(() => {
    if (formData.student_mode === "existing" && formData.student_id) {
      fetchApplicableFees(formData.student_id)
    } else {
      setApplicableFees([])
      setFormData((prev) => ({ ...prev, fee_id: "" }))
    }
  }, [formData.student_mode, formData.student_id])

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students")
      setStudents(res.data)
    } catch (error) {
      console.error("Failed to fetch students:", error)
      toast.error("Failed to fetch students")
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

  const fetchCategories = async () => {
    try {
      const res = await api.get("/student-categories")
      setCategories(res.data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      toast.error("Failed to fetch categories")
    }
  }

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments")
      setPayments(res.data)
    } catch (error) {
      console.error("Failed to fetch payments:", error)
      toast.error("Failed to fetch payments")
    }
  }

  const fetchApplicableFees = async (studentId: string) => {
    try {
      const res = await api.get(`/students/${studentId}/applicable-fees`)
      setApplicableFees(res.data)

      setFormData((prev) => ({
        ...prev,
        fee_id: res.data?.[0]?.fee_id ? String(res.data[0].fee_id) : "",
      }))
    } catch (error) {
      console.error("Failed to fetch applicable fees:", error)
      setApplicableFees([])
      setFormData((prev) => ({ ...prev, fee_id: "" }))
      toast.error("Failed to fetch applicable fee structures")
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === "student_mode") {
      setFormData({
        student_mode: value,
        student_id: "",
        fee_id: "",
        amount_paid: "",
        payment_method: "",
        payment_date: "",
        first_name: "",
        last_name: "",
        gender: "",
        class_id: "",
        category_id: "",
        admission_type: "new",
      })
      setApplicableFees([])
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      student_mode: "existing",
      student_id: "",
      fee_id: "",
      amount_paid: "",
      payment_method: "",
      payment_date: "",
      first_name: "",
      last_name: "",
      gender: "",
      class_id: "",
      category_id: "",
      admission_type: "new",
    })
    setApplicableFees([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload: any = {
        student_mode: formData.student_mode,
        amount_paid: Number(formData.amount_paid),
        payment_method: formData.payment_method,
        payment_date: formData.payment_date,
      }

      if (formData.fee_id) {
        payload.fee_id = Number(formData.fee_id)
      }

      if (formData.student_mode === "existing") {
        payload.student_id = Number(formData.student_id)
      } else {
        payload.first_name = formData.first_name
        payload.last_name = formData.last_name
        payload.gender = formData.gender
        payload.class_id = Number(formData.class_id)
        payload.category_id = Number(formData.category_id)
        payload.admission_type = formData.admission_type
      }

      const res = await api.post("/payments", payload)
      toast.success(res.data?.message || "Payment added successfully")
      resetForm()
      fetchPayments()
      fetchStudents()
    } catch (error: any) {
      console.error("Failed to add payment:", error)
      toast.error(error?.response?.data?.error || "Failed to add payment")
    } finally {
      setLoading(false)
    }
  }

  const selectedStudent =
    formData.student_mode === "existing"
      ? students.find((s) => String(s.student_id) === formData.student_id)
      : null

  const selectedFee = applicableFees.find(
    (fee) => String(fee.fee_id) === formData.fee_id
  )

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">Payments</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Student Mode</label>
            <select
              name="student_mode"
              value={formData.student_mode}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none"
            >
              <option value="existing">Existing Student</option>
              <option value="new">New Student</option>
            </select>
          </div>

          {formData.student_mode === "existing" ? (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium">Student</label>
                <select
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3 outline-none"
                  required
                >
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student.student_id} value={student.student_id}>
                      {student.registration_number} - {student.first_name} {student.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Applicable Fee</label>
                <select
                  name="fee_id"
                  value={formData.fee_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3 outline-none"
                  disabled={!formData.student_id || applicableFees.length === 0}
                >
                  <option value="">Auto-select / Select fee</option>
                  {applicableFees.map((fee) => (
                    <option key={fee.fee_id} value={fee.fee_id}>
                      RWF {Number(fee.total_fee).toLocaleString()} — {fee.category_name} —{" "}
                      {fee.admission_type} — {fee.scope_label}
                    </option>
                  ))}
                </select>
              </div>

              {selectedStudent && (
                <div className="rounded-xl border bg-gray-50 p-3 text-sm md:col-span-2 lg:col-span-3">
                  <div>
                    <strong>Student:</strong> {selectedStudent.first_name} {selectedStudent.last_name}
                  </div>
                  <div>
                    <strong>Admission Type:</strong> {selectedStudent.admission_type}
                  </div>
                </div>
              )}

              {selectedFee && (
                <div className="rounded-xl border bg-blue-50 p-3 text-sm md:col-span-2 lg:col-span-3">
                  <div>
                    <strong>Selected Fee:</strong> RWF {Number(selectedFee.total_fee).toLocaleString()}
                  </div>
                  <div>
                    <strong>Scope:</strong> {selectedFee.scope_label}
                  </div>
                  <div>
                    <strong>Category:</strong> {selectedFee.category_name}
                  </div>
                  <div>
                    <strong>Admission Type:</strong> {selectedFee.admission_type}
                  </div>
                  <div>
                    <strong>Term:</strong> {selectedFee.term_name}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3 outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3 outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3 outline-none"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

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

              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
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

              <div className="rounded-xl border bg-yellow-50 p-3 text-sm md:col-span-2 lg:col-span-3">
                Fee will be resolved automatically after the new student is registered,
                based on current term, category, admission type, and class/general match.
              </div>
            </>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Amount Paid</label>
            <input
              type="number"
              name="amount_paid"
              value={formData.amount_paid}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Payment Method</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none"
              required
            >
              <option value="">Select method</option>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="Mobile Money">Mobile Money</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Payment Date</label>
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none"
              required
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Add Payment"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Payment History</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Student</th>
                <th className="p-3">Term</th>
                <th className="p-3">Fee Scope</th>
                <th className="p-3">Fee Amount</th>
                <th className="p-3">Paid</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.payment_id} className="border-b">
                  <td className="p-3">{payment.student_name}</td>
                  <td className="p-3">{payment.term_name}</td>
                  <td className="p-3">{payment.fee_scope_label}</td>
                  <td className="p-3">RWF {Number(payment.total_fee).toLocaleString()}</td>
                  <td className="p-3">RWF {Number(payment.amount_paid).toLocaleString()}</td>
                  <td className="p-3">
                    {payment.payment_status}
                    {payment.outstanding_balance > 0 && (
                      <div className="text-xs text-red-600">
                        Balance: RWF {Number(payment.outstanding_balance).toLocaleString()}
                      </div>
                    )}
                    {payment.credit_amount > 0 && (
                      <div className="text-xs text-green-600">
                        Credit: RWF {Number(payment.credit_amount).toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No payments found
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