"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, X, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { toast } from "sonner"

type StudentItem = {
  student_id: number
  registration_number: string
  first_name: string
  last_name: string
  gender: string
  class_id: number
  class_name?: string
  section?: string | null
  category_id?: number
  category_name?: string
  admission_type?: "new" | "continuing"
  status?: string
}

type ClassItem = {
  class_id: number
  class_name: string
  section: string | null
}

export default function StudentsPage() {
  const router = useRouter()

  const [students, setStudents] = useState<StudentItem[]>([])
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [loading, setLoading] = useState(false)

  const [activeClass, setActiveClass] = useState<string>("all")
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchStudents()
    fetchClasses()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const res = await api.get("/students")
      setStudents(res.data)
    } catch (error) {
      console.error("Failed to fetch students:", error)
      toast.error("Failed to fetch students")
    } finally {
      setLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes")
      setClasses(res.data)
    } catch (error) {
      console.error("Failed to fetch classes:", error)
      toast.error("Failed to fetch classes")
    }
  }

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return students.filter((student) => {
      const matchesClass =
        activeClass === "all" || String(student.class_id) === activeClass

      const matchesSearch =
        !query ||
        [
          student.registration_number,
          student.first_name,
          student.last_name,
          `${student.first_name} ${student.last_name}`,
          student.gender,
          student.class_name,
          student.section,
          student.category_name,
          student.admission_type,
          student.status,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        )

      return matchesClass && matchesSearch
    })
  }, [students, activeClass, searchTerm])

  const studentCountByClass = useMemo(() => {
    const map = new Map<number, number>()

    students.forEach((student) => {
      map.set(student.class_id, (map.get(student.class_id) || 0) + 1)
    })

    return map
  }, [students])

  const activeClassLabel =
    activeClass === "all"
      ? "All Students"
      : (() => {
          const found = classes.find((c) => String(c.class_id) === activeClass)
          return found
            ? `${found.class_name}${found.section ? ` ${found.section}` : ""}`
            : "Students"
        })()

  const handleSearchToggle = () => {
    if (showSearch && searchTerm.trim()) {
      setSearchTerm("")
    }
    setShowSearch((prev) => !prev)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="glass rounded-3xl p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="glass-title text-2xl font-bold md:text-3xl">
              Students
            </h1>
            <p className="glass-muted mt-1 text-sm">
              View and manage student records class by class.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showSearch ? "w-full opacity-100 sm:w-72" : "w-0 opacity-0"
              }`}
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students..."
                  className="glass-input w-full rounded-2xl py-2.5 pl-10 pr-10"
                />
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/70"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 transition hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSearchToggle}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
              aria-label="Search students"
              title="Search students"
            >
              <Search size={16} />
            </button>

            <button
              type="button"
              onClick={() => router.push("/students/new")}
              className="glass-button flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold"
            >
              <Plus size={16} />
              Add Student
            </button>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveClass("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeClass === "all"
                ? "border border-white/20 bg-white/15 text-white"
                : "border border-transparent bg-white/6 text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            All
            <span className="ml-2 text-[11px] text-white/70">
              {students.length}
            </span>
          </button>

          {classes.map((item) => {
            const count = studentCountByClass.get(item.class_id) || 0
            const isActive = String(item.class_id) === activeClass

            return (
              <button
                key={item.class_id}
                type="button"
                onClick={() => setActiveClass(String(item.class_id))}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? "border border-white/20 bg-white/15 text-white"
                    : "border border-transparent bg-white/6 text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.class_name} {item.section || ""}
                <span className="ml-2 text-[11px] text-white/70">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="glass-note rounded-2xl p-4 text-sm">
          <span className="glass-muted">Showing:</span>{" "}
          <span className="glass-title font-medium">{activeClassLabel}</span>
          <span className="glass-muted">
            {" "}
            • {filteredStudents.length} student
            {filteredStudents.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 md:p-8">
        <div className="mb-6">
          <h2 className="glass-title text-xl font-semibold md:text-2xl">
            Student Records
          </h2>
          <p className="glass-muted mt-1 text-sm">
            Filtered by selected class and search text.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl glass-table">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-4">Reg No</th>
                <th className="p-4">Student</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Class</th>
                <th className="p-4">Category</th>
                <th className="p-4">Admission</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.student_id}>
                  <td className="p-4">{student.registration_number}</td>
                  <td className="p-4">
                    <div className="glass-title font-medium">
                      {student.first_name} {student.last_name}
                    </div>
                  </td>
                  <td className="p-4">{student.gender}</td>
                  <td className="p-4">
                    {student.class_name} {student.section || ""}
                  </td>
                  <td className="p-4">{student.category_name || "-"}</td>
                  <td className="p-4 capitalize">
                    {student.admission_type || "-"}
                  </td>
                  <td className="p-4 capitalize">{student.status || "-"}</td>
                </tr>
              ))}

              {!loading && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="glass-muted p-8 text-center">
                    No students matched the selected class or search.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={7} className="glass-muted p-8 text-center">
                    Loading students...
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