"use client"

import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { LogOut } from "lucide-react"

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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>

          <p className="text-sm text-slate-300">
            {userName
              ? `${userName} • ${role?.toUpperCase() || ""}`
              : "School Fees Management System"}
          </p>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">

          {/* User badge */}
          {userName && (
            <div className="hidden items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-xl sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-white">
                {userName?.charAt(0).toUpperCase()}
              </div>

              <div className="leading-tight">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-slate-300">
                  {role?.toUpperCase()}
                </p>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/80 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-red-600"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>

        </div>
      </div>
    </header>
  )
}