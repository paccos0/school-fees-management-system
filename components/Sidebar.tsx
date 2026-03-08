"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/students", label: "Students" },
  { href: "/payments", label: "Payments" },
  { href: "/fees", label: "Fees" },
  { href: "/penalties", label: "Penalties" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-800 bg-slate-900 text-white md:block">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-wide">SFMS</h2>
        <p className="mt-1 text-sm text-slate-400">
          School Fees Management
        </p>
      </div>

      <nav className="px-4 pb-6 space-y-2">
        {links.map((link) => {
          const active = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}