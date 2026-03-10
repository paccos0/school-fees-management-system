"use client"

import { useEffect, useMemo, useState } from "react"
import DashboardCard from "@/components/DashboardCard"
import api from "@/lib/api"
import { toast } from "sonner"

type ClassDebt = {
  class_name: string
  unpaidStudents: number
  unpaidBalance: number
}

type TermSummary = {
  year_name: string
  term_name: string
  unpaidStudents: number
  expectedFees: number
  collectedFees: number
  unpaidBalance: number
}

type DashboardStats = {
  totalStudents: number
  totalPaid: number
  unpaidStudents: number
  totalUnpaidBalance: number
  totalCredit: number
  totalPenalties: number
  classDebts: ClassDebt[]
  termSummaries: TermSummary[]
}

type CurrentUser = {
  admin_id: number
  username: string
  first_name: string
  last_name: string
  role: string
}

type TermOption = {
  term_id: number
  term_name: string
  year_name: string
  is_current: number
}

function formatMoney(value: number) {
  return `RWF ${Number(value || 0).toLocaleString()}`
}

const defaultDashboardData: DashboardStats = {
  totalStudents: 0,
  totalPaid: 0,
  unpaidStudents: 0,
  totalUnpaidBalance: 0,
  totalCredit: 0,
  totalPenalties: 0,
  classDebts: [],
  termSummaries: [],
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats>(defaultDashboardData)
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [terms, setTerms] = useState<TermOption[]>([])
  const [currentTermId, setCurrentTermId] = useState<number | "">("")
  const [switchingTerm, setSwitchingTerm] = useState(false)

  useEffect(() => {
    loadDashboardPage()
    loadTerms()
  }, [])

  const loadDashboardPage = async () => {
    setLoading(true)

    try {
      const [dashboardRes, meRes] = await Promise.allSettled([
        api.get("/dashboard"),
        api.get("/auth/me"),
      ])

      if (dashboardRes.status === "fulfilled") {
        const dashboardData = dashboardRes.value?.data || {}

        setData({
          totalStudents: Number(dashboardData.totalStudents ?? 0),
          totalPaid: Number(dashboardData.totalPaid ?? 0),
          unpaidStudents: Number(dashboardData.unpaidStudents ?? 0),
          totalUnpaidBalance: Number(dashboardData.totalUnpaidBalance ?? 0),
          totalCredit: Number(dashboardData.totalCredit ?? 0),
          totalPenalties: Number(dashboardData.totalPenalties ?? 0),
          classDebts: Array.isArray(dashboardData.classDebts)
            ? dashboardData.classDebts
            : [],
          termSummaries: Array.isArray(dashboardData.termSummaries)
            ? dashboardData.termSummaries
            : [],
        })
      } else {
        console.error(
          "Dashboard request failed:",
          dashboardRes.reason?.response?.data || dashboardRes.reason
        )
        setData(defaultDashboardData)
      }

      if (meRes.status === "fulfilled") {
        setUser(meRes.value?.data ?? null)
      } else {
        console.error(
          "Auth/me request failed:",
          meRes.reason?.response?.data || meRes.reason
        )
        setUser(null)
      }
    } catch (error) {
      console.error("Unexpected dashboard load error:", error)
      setData(defaultDashboardData)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const loadTerms = async () => {
    try {
      const res = await api.get("/term/list")
      const rows = Array.isArray(res.data) ? res.data : []
      setTerms(rows)

      const active = rows.find((term: TermOption) => Number(term.is_current) === 1)
      if (active) {
        setCurrentTermId(Number(active.term_id))
      }
    } catch (error) {
      console.error("Failed to load terms:", error)
    }
  }

  const handleSwitchTerm = async (termId: number) => {
    try {
      setSwitchingTerm(true)
      await api.post("/term/switch", { term_id: termId })
      setCurrentTermId(termId)
      await Promise.all([loadTerms(), loadDashboardPage()])
      toast.success("Academic term switched successfully")
    } catch (error: any) {
      console.error("Failed to switch term:", error)
      toast.error(error?.response?.data?.error || "Failed to switch term")
    } finally {
      setSwitchingTerm(false)
    }
  }

  const fullName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
    : ""

  const firstName = user?.first_name || "User"
  const role = user?.role || "staff"
  const initials =
    `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}` || "U"

  const worstClassDebt = useMemo(() => {
    if (!data.classDebts.length) return null
    return data.classDebts[0]
  }, [data.classDebts])

  const latestTermSummary = useMemo(() => {
    if (!data.termSummaries.length) return null
    return data.termSummaries[0]
  }, [data.termSummaries])

  const activeTermLabel = useMemo(() => {
    const active = terms.find((term) => Number(term.term_id) === Number(currentTermId))
    if (!active) return "No active term"
    return `${active.year_name} • ${active.term_name}`
  }, [terms, currentTermId])

  return (
    <div className="relative min-h-screen overflow-hidden rounded-[28px] bg-slate-950 p-4 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.22),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.18),_transparent_35%)]" />
      <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10">
        <section className="mb-8 rounded-[30px] border border-white/15 bg-white/10 p-6 text-white shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-100/80">
                School Fees Management System
              </p>

              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                Welcome back, {loading ? "..." : firstName}
              </h1>

              <p className="mt-2 text-sm text-white/70 sm:text-base">
                {loading
                  ? "Loading your profile..."
                  : `${fullName} • ${role.toUpperCase()}`}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-bold text-white shadow-lg">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {loading ? "Loading..." : fullName || "User"}
                  </p>
                  <p className="text-xs text-white/60">
                    {user?.username ? `@${user.username}` : ""}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Active Term
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {activeTermLabel}
                </p>

                <select
                  value={currentTermId}
                  onChange={(e) => handleSwitchTerm(Number(e.target.value))}
                  disabled={switchingTerm || terms.length === 0}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none"
                >
                  {terms.map((term) => (
                    <option key={term.term_id} value={term.term_id}>
                      {term.year_name} • {term.term_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg backdrop-blur-xl">
              <p className="text-sm text-white/70">Collected fees</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {formatMoney(data.totalPaid)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg backdrop-blur-xl">
              <p className="text-sm text-white/70">Total student credit</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {formatMoney(data.totalCredit)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg backdrop-blur-xl">
              <p className="text-sm text-white/70">Most affected class</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {worstClassDebt?.class_name || "-"}
              </p>
              <p className="mt-1 text-sm text-white/60">
                {worstClassDebt
                  ? `${worstClassDebt.unpaidStudents} students • ${formatMoney(
                      worstClassDebt.unpaidBalance
                    )}`
                  : "No class debt data"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg backdrop-blur-xl">
              <p className="text-sm text-white/70">Latest term snapshot</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {latestTermSummary ? latestTermSummary.term_name : "No term data"}
              </p>
              <p className="mt-1 text-sm text-white/60">
                {latestTermSummary
                  ? `${latestTermSummary.year_name} • ${formatMoney(
                      latestTermSummary.unpaidBalance
                    )} unpaid`
                  : "No term summary yet"}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Total Students"
            value={data.totalStudents}
            subtitle="All registered students"
          />
          <DashboardCard
            title="Collected Fees"
            value={formatMoney(data.totalPaid)}
            subtitle="Total school fees collected"
          />
          <DashboardCard
            title="Total Credit"
            value={formatMoney(data.totalCredit)}
            subtitle="Excess payments by students"
          />
          <DashboardCard
            title="Penalties"
            value={formatMoney(data.totalPenalties)}
            subtitle="Unpaid damage penalties"
          />
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Class debt overview
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  Unpaid balances grouped by class.
                </p>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[620px]">
                <thead className="bg-white/5">
                  <tr className="text-left text-sm text-white/70">
                    <th className="px-4 py-3 font-semibold">Class</th>
                    <th className="px-4 py-3 font-semibold">Unpaid Students</th>
                    <th className="px-4 py-3 font-semibold">Outstanding Balance</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {data.classDebts.map((item, index) => (
                    <tr
                      key={`${item.class_name}-${index}`}
                      className="text-sm text-white/85 transition hover:bg-white/5"
                    >
                      <td className="px-4 py-3 font-medium">{item.class_name}</td>
                      <td className="px-4 py-3">{item.unpaidStudents}</td>
                      <td className="px-4 py-3 font-semibold text-rose-300">
                        {formatMoney(item.unpaidBalance)}
                      </td>
                    </tr>
                  ))}

                  {data.classDebts.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-10 text-center text-sm text-white/55"
                      >
                        No class debt data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
            <h2 className="text-lg font-semibold text-white">Logged-in User</h2>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-lg font-bold text-white shadow-lg">
                {initials}
              </div>

              <div>
                <p className="font-semibold text-white">
                  {loading ? "Loading..." : fullName || "User"}
                </p>
                <p className="text-sm text-white/60">
                  {user?.username ? `@${user.username}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-white/70">
              <div className="flex justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <span>Role</span>
                <span className="font-medium text-white">{role.toUpperCase()}</span>
              </div>
              <div className="flex justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <span>Status</span>
                <span className="font-medium text-emerald-300">Active</span>
              </div>
              <div className="flex justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <span>Students with debt</span>
                <span className="font-medium text-white">{data.unpaidStudents}</span>
              </div>
              <div className="flex justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <span>Total debt</span>
                <span className="font-medium text-rose-300">
                  {formatMoney(data.totalUnpaidBalance)}
                </span>
              </div>
              <div className="flex justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <span>Total credit</span>
                <span className="font-medium text-emerald-300">
                  {formatMoney(data.totalCredit)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
          <h2 className="text-lg font-semibold text-white">Academic term performance</h2>
          <p className="mt-2 text-sm text-white/60">
            Fee performance for terms with recorded data in the active academic year.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="bg-white/5">
                <tr className="text-left text-sm text-white/70">
                  <th className="px-4 py-3 font-semibold">Academic Year</th>
                  <th className="px-4 py-3 font-semibold">Term</th>
                  <th className="px-4 py-3 font-semibold">Expected Fees</th>
                  <th className="px-4 py-3 font-semibold">Collected</th>
                  <th className="px-4 py-3 font-semibold">Unpaid Balance</th>
                  <th className="px-4 py-3 font-semibold">Students in Debt</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {data.termSummaries.map((item, index) => (
                  <tr
                    key={`${item.year_name}-${item.term_name}-${index}`}
                    className="text-sm text-white/85 transition hover:bg-white/5"
                  >
                    <td className="px-4 py-3">{item.year_name}</td>
                    <td className="px-4 py-3 font-medium">{item.term_name}</td>
                    <td className="px-4 py-3">{formatMoney(item.expectedFees)}</td>
                    <td className="px-4 py-3 text-emerald-300">
                      {formatMoney(item.collectedFees)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-rose-300">
                      {formatMoney(item.unpaidBalance)}
                    </td>
                    <td className="px-4 py-3">{item.unpaidStudents}</td>
                  </tr>
                ))}

                {data.termSummaries.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-sm text-white/55"
                    >
                      No term summary data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}