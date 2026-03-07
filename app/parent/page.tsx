"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"
import DashboardCard from "@/components/DashboardCard"

export default function ParentDashboard() {
  const [data, setData] = useState<any>({})
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  useEffect(() => {
    setFirstName(localStorage.getItem("first_name") || "")
    setLastName(localStorage.getItem("last_name") || "")
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard/parent") // parent-specific dashboard API
      setData(res.data)
    } catch (err) {
      console.error("Failed to load parent dashboard", err)
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar title={`Welcome ${firstName} ${lastName}`} />

        <div className="grid grid-cols-3 gap-4 p-6">
          <DashboardCard title="Total Students" value={data.totalStudents} />
          <DashboardCard title="Total Paid" value={data.totalPaid} />
          <DashboardCard title="Remaining Fees" value={data.remainingFees} />
        </div>
      </div>
    </div>
  )
}