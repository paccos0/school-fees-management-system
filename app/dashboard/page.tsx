"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"
import DashboardCard from "@/components/DashboardCard"
import api from "@/lib/api"

type DashboardStats = {
  totalStudents: number
  totalPaid: number
  unpaidStudents: number
  totalPenalties: number
}

type CurrentUser = {
  admin_id: number
  username: string
  first_name: string
  last_name: string
  role: string
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats>({
    totalStudents: 0,
    totalPaid: 0,
    unpaidStudents: 0,
    totalPenalties: 0,
  })

  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardPage()
  }, [])

  const loadDashboardPage = async () => {
    try {
      const [dashboardRes, meRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/auth/me"),
      ])

      setData(dashboardRes.data)
      setUser(meRes.data)
    } catch (error) {
      console.error("Failed to load dashboard page:", error)
    } finally {
      setLoading(false)
    }
  }

  const fullName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
    : ""

  const firstName = user?.first_name || "User"
  const role = user?.role || "staff"
  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}` || "U"

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1">
          <Navbar title="Dashboard" userName={fullName} role={role} />

          <main className="p-6 md:p-8">
            <section className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg">
              <p className="text-sm uppercase tracking-wide text-blue-100">
                School Fees Management System
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Welcome back, {loading ? "..." : firstName}
              </h1>

              <p className="mt-2 text-sm text-blue-100">
                {loading ? "Loading your profile..." : `${fullName} • ${role.toUpperCase()}`}
              </p>
            </section>

            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <DashboardCard
                title="Total Students"
                value={data.totalStudents}
                subtitle="All registered students"
              />

              <DashboardCard
                title="Total Paid"
                value={`RWF ${Number(data.totalPaid).toLocaleString()}`}
                subtitle="Collected school fees"
              />

              <DashboardCard
                title="Unpaid Students"
                value={data.unpaidStudents}
                subtitle="Students with pending balances"
              />

              <DashboardCard
                title="Penalties"
                value={`RWF ${Number(data.totalPenalties).toLocaleString()}`}
                subtitle="Displinary Penalities"
              />
            </section>

            <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
                <p className="mt-2 text-sm text-gray-500">
                  This dashboard gives you a quick summary of students, payments,
                  unpaid balances, and penalties. You can use it as the bursar’s
                  main control center.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-blue-50 p-4">
                    <p className="text-sm font-medium text-blue-700">Payment Status</p>
                    <p className="mt-2 text-sm text-gray-700">
                      Track which students have cleared fees and who still has a balance.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-700">Outstanding Fees</p>
                    <p className="mt-2 text-sm text-gray-700">
                      Follow up on unpaid students and apply penalties when necessary.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Logged-in User</h2>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                    {initials}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {loading ? "Loading..." : fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user?.username ? `@${user.username}` : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Role</span>
                    <span className="font-medium text-gray-900">
                      {loading ? "..." : role}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}