"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

const handleLogin = async (e: any) => {
  e.preventDefault()
  setLoading(true)

  try {
    const res = await api.post("/auth/login", { username, password })
    const data = res.data

    console.log("LOGIN RESPONSE:", data)

    if (data.role === "bursar") {
      router.push("/dashboard")
      router.refresh()
    } else if (data.role === "admin") {
      router.push("/dashboard")
      router.refresh()
    } else {
      alert("Unknown role")
    }
  } catch (err: any) {
    alert(err?.response?.data?.error || "Login failed")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white text-black p-8 shadow-md rounded w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">SFMS Login</h2>

        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-600 text-white w-full p-2 rounded transition ${loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}