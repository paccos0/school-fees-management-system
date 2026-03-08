"use client"

import { useRouter } from "next/navigation"
import api from "@/lib/api"

interface NavbarProps {
  title: string
  userName?: string
  role?: string
}

export default function Navbar({ title, userName, role }: NavbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">
            {userName ? `${userName} • ${role?.toUpperCase() || ""}` : "School Fees Management System"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  )
}