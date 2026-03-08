"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      const res = await api.get("/payments")
      setPayments(res.data)
    } catch (error) {
      console.error("Failed to fetch payments:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="mt-2 text-sm text-gray-500">
          Review all school fee payment records.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4 font-semibold">Student ID</th>
                <th className="px-6 py-4 font-semibold">Fee ID</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Method</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Reference</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {payments.map((p: any) => (
                <tr key={p.payment_id} className="text-sm text-gray-700">
                  <td className="px-6 py-4">{p.student_id}</td>
                  <td className="px-6 py-4">{p.fee_id}</td>
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
    </div>
  )
}