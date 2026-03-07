"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"
import DashboardCard from "@/components/DashboardCard"
import api from "@/lib/api"

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<any>({
    totalStudents: 0,
    totalPaid: 0,
    unpaidStudents: 0,
    totalPenalties: 0,
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/login")
    else loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard")
      setData(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar title="Bursar Dashboard" />
        <div className="grid grid-cols-4 gap-4 p-6">
          <DashboardCard title="Total Students" value={data.totalStudents} />
          <DashboardCard title="Total Paid" value={data.totalPaid} />
          <DashboardCard title="Unpaid Students" value={data.unpaidStudents} />
          <DashboardCard title="Penalties" value={data.totalPenalties} />
        </div>
      </div>
    </div>
  )
}