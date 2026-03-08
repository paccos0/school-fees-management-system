"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/api"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [fees, setFees] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  const [formData, setFormData] = useState({
    student_mode: "existing",

    student_id: "",
    fee_id: "",
    amount_paid: "",
    payment_method: "",
    payment_date: "",
    transaction_reference: "",

    registration_number: "",
    first_name: "",
    last_name: "",
    gender: "",
    class_id: "",
    category_id: "",
    admission_type: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [paymentsRes, studentsRes, feesRes, classesRes, categoriesRes] =
        await Promise.all([
          api.get("/payments"),
          api.get("/students"),
          api.get("/fees"),
          api.get("/classes"),
          api.get("/student-categories"),
        ])

      setPayments(paymentsRes.data)
      setStudents(studentsRes.data)
      setFees(feesRes.data)
      setClasses(classesRes.data)
      setCategories(categoriesRes.data)
    } catch (error) {
      console.error("Failed to fetch payments:", error)
      toast.error("Failed to load payments data")
    }
  }

  const resetForm = () => {
    setFormData({
      student_mode: "existing",

      student_id: "",
      fee_id: "",
      amount_paid: "",
      payment_method: "",
      payment_date: "",
      transaction_reference: "",

      registration_number: "",
      first_name: "",
      last_name: "",
      gender: "",
      class_id: "",
      category_id: "",
      admission_type: "",
    })
  }

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await api.post("/payments", {
        ...formData,
        student_id: formData.student_id ? Number(formData.student_id) : null,
        fee_id: Number(formData.fee_id),
        amount_paid: Number(formData.amount_paid),
        class_id: formData.class_id ? Number(formData.class_id) : null,
        category_id: formData.category_id
          ? Number(formData.category_id)
          : null,
      })

      toast.success("Payment added successfully")
      setShowAddModal(false)
      resetForm()
      loadData()
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.error || "Failed to add payment")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="mt-2 text-sm text-gray-500">
            Review all school fee payment records.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm()
            setShowAddModal(true)
          }}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add Payment
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold">Class</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Method</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Reference</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {payments.map((p: any) => (
                <tr key={p.payment_id} className="text-sm text-gray-700">
                  <td className="px-6 py-4 font-medium">{p.student_name}</td>

                  <td className="px-6 py-4">
                    {p.class_name} {p.section}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    RWF {Number(p.amount_paid).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">{p.payment_method}</td>

                  <td className="px-6 py-4">{p.payment_date}</td>

                  <td className="px-6 py-4">{p.transaction_reference}</td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">Add Payment</h2>

            <form onSubmit={handleAddPayment} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <select
                  value={formData.student_mode}
                  onChange={(e) =>
                    setFormData({ ...formData, student_mode: e.target.value })
                  }
                  className="rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="existing">Existing Student</option>
                  <option value="new">New Student</option>
                </select>

                {formData.student_mode === "existing" ? (
                  <select
                    value={formData.student_id}
                    onChange={(e) =>
                      setFormData({ ...formData, student_id: e.target.value })
                    }
                    className="rounded-xl border border-gray-300 px-4 py-3"
                    required
                  >
                    <option value="">Select student</option>
                    {students.map((student: any) => (
                      <option
                        key={student.student_id}
                        value={student.student_id}
                      >
                        {student.first_name} {student.last_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-blue-600 md:flex md:items-center">
                    New student details below will be saved first.
                  </div>
                )}
              </div>

              {formData.student_mode === "new" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    className="rounded-xl border border-gray-300 px-4 py-3"
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
                    className="rounded-xl border border-gray-300 px-4 py-3"
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
                    className="rounded-xl border border-gray-300 px-4 py-3"
                    required
                  />

                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="rounded-xl border border-gray-300 px-4 py-3"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                  <select
                    value={formData.class_id}
                    onChange={(e) =>
                      setFormData({ ...formData, class_id: e.target.value })
                    }
                    className="rounded-xl border border-gray-300 px-4 py-3"
                    required
                  >
                    <option value="">Select class</option>
                    {classes.map((cls: any) => (
                      <option key={cls.class_id} value={cls.class_id}>
                        {cls.class_name} {cls.section}
                      </option>
                    ))}
                  </select>

                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="rounded-xl border border-gray-300 px-4 py-3"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={formData.admission_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        admission_type: e.target.value,
                      })
                    }
                    className="rounded-xl border border-gray-300 px-4 py-3 md:col-span-2"
                    required
                  >
                    <option value="">Select admission type</option>
                    <option value="new">New</option>
                    <option value="continuing">Continuing</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <select
                  value={formData.fee_id}
                  onChange={(e) =>
                    setFormData({ ...formData, fee_id: e.target.value })
                  }
                  className="rounded-xl border border-gray-300 px-4 py-3"
                  required
                >
                  <option value="">Select fee structure</option>
                  {fees.map((fee: any) => (
                    <option key={fee.fee_id} value={fee.fee_id}>
                      {fee.class_name} {fee.section} - {fee.category_name} -{" "}
                      {fee.admission_type} - RWF{" "}
                      {Number(fee.total_fee).toLocaleString()}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Amount Paid"
                  value={formData.amount_paid}
                  onChange={(e) =>
                    setFormData({ ...formData, amount_paid: e.target.value })
                  }
                  className="rounded-xl border border-gray-300 px-4 py-3"
                  required
                />

                <select
                  value={formData.payment_method}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payment_method: e.target.value,
                    })
                  }
                  className="rounded-xl border border-gray-300 px-4 py-3"
                  required
                >
                  <option value="">Select method</option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                  <option value="mobile_money">Mobile Money</option>
                </select>

                <input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_date: e.target.value })
                  }
                  className="rounded-xl border border-gray-300 px-4 py-3"
                  required
                />

                <input
                  type="text"
                  placeholder="Transaction Reference"
                  value={formData.transaction_reference}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transaction_reference: e.target.value,
                    })
                  }
                  className="rounded-xl border border-gray-300 px-4 py-3 md:col-span-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
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
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}