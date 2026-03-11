"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, X } from "lucide-react"
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

  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

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

  const filteredPayments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) return payments

    return payments.filter((payment: any) => {
      const values = [
        payment.student_name,
        payment.term_name,
        payment.fee_scope_label,
        payment.payment_status,
        payment.payment_method,
        payment.transaction_reference,
        String(payment.total_fee ?? ""),
        String(payment.amount_paid ?? ""),
        String(payment.outstanding_balance ?? ""),
        String(payment.credit_amount ?? ""),
      ]

      return values.some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    })
  }, [payments, searchTerm])

  const handleSearchToggle = () => {
    if (showSearch && searchTerm.trim()) {
      setSearchTerm("")
    }
    setShowSearch((prev) => !prev)
  }

  return (
    <div className="page-overlay min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-fixed p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="glass rounded-3xl p-6 md:p-8">
          <div className="mb-6">
            <h1 className="glass-title text-2xl font-bold md:text-3xl">
              Payments
            </h1>
            <p className="glass-muted mt-1 text-sm">
              Record student payments with class-based or general fee support.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <div>
              <label className="glass-text mb-2 block text-sm font-medium">
                Student Mode
              </label>
              <select
                name="student_mode"
                value={formData.student_mode}
                onChange={handleChange}
                className="glass-input w-full rounded-2xl px-4 py-3"
              >
                <option value="existing" className="text-black">
                  Existing Student
                </option>
                <option value="new" className="text-black">
                  New Student
                </option>
              </select>
            </div>

            {formData.student_mode === "existing" ? (
              <>
                <div>
                  <label className="glass-text mb-2 block text-sm font-medium">
                    Student
                  </label>
                  <select
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    className="glass-input w-full rounded-2xl px-4 py-3"
                    required
                  >
                    <option value="" className="text-black">
                      Select student
                    </option>
                    {students.map((student) => (
                      <option
                        key={student.student_id}
                        value={student.student_id}
                        className="text-black"
                      >
                        {student.registration_number} - {student.first_name}{" "}
                        {student.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="glass-text mb-2 block text-sm font-medium">
                    Applicable Fee
                  </label>
                  <select
                    name="fee_id"
                    value={formData.fee_id}
                    onChange={handleChange}
                    className="glass-input w-full rounded-2xl px-4 py-3"
                    disabled={!formData.student_id || applicableFees.length === 0}
                  >
                    <option value="" className="text-black">
                      Auto-select / Select fee
                    </option>
                    {applicableFees.map((fee) => (
                      <option
                        key={fee.fee_id}
                        value={fee.fee_id}
                        className="text-black"
                      >
                        RWF {Number(fee.total_fee).toLocaleString()} —{" "}
                        {fee.category_name} — {fee.admission_type} —{" "}
                        {fee.scope_label}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedStudent && (
                  <div className="glass-note rounded-2xl p-4 text-sm md:col-span-2 lg:col-span-3">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <span className="glass-muted">Student</span>
                        <div className="glass-title font-semibold">
                          {selectedStudent.first_name} {selectedStudent.last_name}
                        </div>
                      </div>
                      <div>
                        <span className="glass-muted">Admission Type</span>
                        <div className="glass-text capitalize">
                          {selectedStudent.admission_type}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFee && (
                  <div className="glass-soft rounded-2xl p-4 text-sm md:col-span-2 lg:col-span-3">
                    <div className="mb-3">
                      <span className="glass-muted">Selected Fee</span>
                      <div className="glass-title text-lg font-semibold">
                        RWF {Number(selectedFee.total_fee).toLocaleString()}
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <span className="glass-muted">Scope</span>
                        <div className="glass-text">{selectedFee.scope_label}</div>
                      </div>
                      <div>
                        <span className="glass-muted">Category</span>
                        <div className="glass-text">{selectedFee.category_name}</div>
                      </div>
                      <div>
                        <span className="glass-muted">Admission Type</span>
                        <div className="glass-text capitalize">
                          {selectedFee.admission_type}
                        </div>
                      </div>
                      <div>
                        <span className="glass-muted">Term</span>
                        <div className="glass-text">{selectedFee.term_name}</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <label className="glass-text mb-2 block text-sm font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="glass-input w-full rounded-2xl px-4 py-3"
                    required
                  />
                </div>

                <div>
                  <label className="glass-text mb-2 block text-sm font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="glass-input w-full rounded-2xl px-4 py-3"
                    required
                  />
                </div>

                <div>
                  <label className="glass-text mb-2 block text-sm font-medium">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="glass-input w-full rounded-2xl px-4 py-3"
                    required
                  >
                    <option value="" className="text-black">
                      Select gender
                    </option>
                    <option value="Male" className="text-black">
                      Male
                    </option>
                    <option value="Female" className="text-black">
                      Female
                    </option>
                  </select>
                </div>

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

                <div>
                  <label className="glass-text mb-2 block text-sm font-medium">
                    Category
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

                <div className="glass-note rounded-2xl p-4 text-sm md:col-span-2 lg:col-span-3">
                  Fee will be resolved automatically after the new student is
                  registered, based on current term, category, admission type, and
                  class/general match.
                </div>
              </>
            )}

            <div>
              <label className="glass-text mb-2 block text-sm font-medium">
                Amount Paid
              </label>
              <input
                type="number"
                name="amount_paid"
                value={formData.amount_paid}
                onChange={handleChange}
                className="glass-input w-full rounded-2xl px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="glass-text mb-2 block text-sm font-medium">
                Payment Method
              </label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="glass-input w-full rounded-2xl px-4 py-3"
                required
              >
                <option value="" className="text-black">
                  Select method
                </option>
                <option value="Cash" className="text-black">
                  Cash
                </option>
                <option value="Bank" className="text-black">
                  Bank
                </option>
                <option value="Mobile Money" className="text-black">
                  Mobile Money
                </option>
              </select>
            </div>

            <div>
              <label className="glass-text mb-2 block text-sm font-medium">
                Payment Date
              </label>
              <input
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                className="glass-input w-full rounded-2xl px-4 py-3"
                required
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="glass-button rounded-2xl px-6 py-3 font-semibold"
              >
                {loading ? "Saving..." : "Add Payment"}
              </button>
            </div>
          </form>
        </div>

        <div className="glass rounded-3xl p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="glass-title text-xl font-semibold md:text-2xl">
                Payment History
              </h2>
              <p className="glass-muted mt-1 text-sm">
                Review all recorded student payments and balances.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showSearch ? "w-full opacity-100 md:w-80" : "w-0 opacity-0"
                }`}
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search student, term, amount, status..."
                    className="glass-input w-full rounded-2xl py-3 pl-11 pr-11"
                  />
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/70"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 transition hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSearchToggle}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                aria-label="Toggle search"
                title="Search payments"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {searchTerm && (
            <div className="glass-note mb-4 rounded-2xl p-3 text-sm">
              Showing {filteredPayments.length} result
              {filteredPayments.length !== 1 ? "s" : ""} for{" "}
              <span className="glass-title font-medium">"{searchTerm}"</span>
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl glass-table">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="p-4">Student</th>
                  <th className="p-4">Term</th>
                  <th className="p-4">Fee Scope</th>
                  <th className="p-4">Fee Amount</th>
                  <th className="p-4">Paid</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment: any) => (
                  <tr key={payment.payment_id}>
                    <td className="p-4">
                      <div className="glass-title font-medium">
                        {payment.student_name}
                      </div>
                    </td>
                    <td className="p-4">{payment.term_name}</td>
                    <td className="p-4">{payment.fee_scope_label}</td>
                    <td className="p-4">
                      RWF {Number(payment.total_fee).toLocaleString()}
                    </td>
                    <td className="p-4">
                      RWF {Number(payment.amount_paid).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="glass-text">{payment.payment_status}</div>

                      {payment.outstanding_balance > 0 && (
                        <div className="glass-muted mt-1 text-xs">
                          Balance: RWF{" "}
                          {Number(payment.outstanding_balance).toLocaleString()}
                        </div>
                      )}

                      {payment.credit_amount > 0 && (
                        <div className="glass-muted mt-1 text-xs">
                          Credit: RWF{" "}
                          {Number(payment.credit_amount).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="glass-muted p-8 text-center">
                      {searchTerm
                        ? "No payments matched your search"
                        : "No payments found"}
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