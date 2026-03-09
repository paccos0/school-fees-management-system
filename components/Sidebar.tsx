"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Wallet,
  BadgeDollarSign,
  ShieldAlert,
} from "lucide-react"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/payments", label: "Payments", icon: Wallet },
  { href: "/fees", label: "Fees", icon: BadgeDollarSign },
  { href: "/penalties", label: "Penalties", icon: ShieldAlert },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-slate-950/75 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:block">
      <div className="relative h-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),_transparent_35%)]" />
        <div className="absolute left-0 top-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-lg font-bold text-white shadow-lg backdrop-blur-xl">
                SF
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-wide text-white">
                  SFMS
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  School Fees Management
                </p>
              </div>
            </div>
          </div>

          <nav className="space-y-2 px-4 py-6">
            {links.map((link) => {
              const active = pathname === link.href
              const Icon = link.icon

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    active
                      ? "border border-cyan-300/30 bg-white/15 text-white shadow-lg backdrop-blur-xl"
                      : "border border-transparent bg-white/5 text-slate-200 hover:border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      active
                        ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-md"
                        : "bg-slate-800/80 text-slate-200 group-hover:bg-slate-700/80 group-hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto p-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-lg backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                SFMS Panel
              </p>
              <p className="mt-2 text-sm font-medium text-white">
                Manage students, fees, payments and penalties in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}