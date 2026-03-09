"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await api.post("/auth/login", { username, password })
      const data = res.data

      console.log("LOGIN RESPONSE:", data)

      if (data.role === "bursar" || data.role === "admin") {
        toast.success("Login successful")
        router.push("/dashboard")
        router.refresh()
      } else {
        toast.error("Unknown role")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Internal server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* animated glow blobs */}
      <div className="absolute left-[-80px] top-[-60px] h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl animate-pulse" />
      <div className="absolute right-[-100px] top-[20%] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-[-80px] left-[35%] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />

      {/* center container */}
      <div className="relative z-10 grid min-h-screen place-items-center px-4">
        <div className="w-full max-w-[360px]">
          <form
            onSubmit={handleLogin}
            className="rounded-[28px] border border-white/20 bg-white/10 p-7 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
                <ShieldCheck className="h-8 w-8 text-cyan-300" />
              </div>

              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
              <p className="mt-2 text-sm text-white/75">
                Sign in to access SFMS dashboard
              </p>
            </div>

            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/85">
                  Username
                </label>

                <div className="flex h-12 items-center rounded-2xl border border-white/20 bg-white/10 px-4 backdrop-blur-md transition duration-200 focus-within:border-cyan-300">
                  <User className="mr-3 h-5 w-5 text-white/65" />
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-transparent text-white placeholder:text-white/45 outline-none focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/85">
                  Password
                </label>

                <div className="flex h-12 items-center rounded-2xl border border-white/20 bg-white/10 px-4 backdrop-blur-md transition duration-200 focus-within:border-fuchsia-300">
                  <Lock className="mr-3 h-5 w-5 text-white/65" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent text-white placeholder:text-white/45 outline-none focus:outline-none focus:ring-0"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2 text-white/70 hover:text-white focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`relative mt-2 flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 font-semibold text-white shadow-lg transition duration-300 ${
                  loading
                    ? "cursor-not-allowed opacity-70"
                    : "hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                <span className="absolute inset-0 animate-pulse bg-white/10" />
                <span className="relative z-10">
                  {loading ? "Logging in..." : "Login"}
                </span>
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-white/55">
              Secure School Fees Management System
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}