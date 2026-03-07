"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"

export default function PaymentsPage() {

  const [payments, setPayments] = useState([])

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    const res = await api.get("/payments")
    setPayments(res.data)
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl mb-4">Payments</h1>

      <table className="w-full border">

        <thead>
          <tr>
            <th>Student</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {payments.map((p: any) => (
            <tr key={p.payment_id}>
              <td>{p.student_id}</td>
              <td>{p.amount_paid}</td>
              <td>{p.payment_date}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}