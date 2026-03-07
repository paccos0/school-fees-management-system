"use client"

import { useState } from "react"
import api from "@/lib/api"

export default function SignupAdminPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "bursar",
    first_name: "",
    last_name: "",
    gender: "male",
    dob: "",
    address: "",
  })
  const [message, setMessage] = useState("")

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e: any) => {
    e.preventDefault()
    try {
      await api.post("/auth/signup", form)
      setMessage("Admin created successfully. You can delete this page now.")
    } catch (err: any) {
      setMessage(err?.response?.data?.error || "Failed")
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 text-black shadow-md rounded w-96 space-y-3"
      >
        <h2 className="text-2xl mb-2">Create Admin</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="border p-2 w-full"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={form.password}
          onChange={handleChange}
        />

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          className="border p-2 w-full"
          value={form.first_name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          className="border p-2 w-full"
          value={form.last_name}
          onChange={handleChange}
        />

        <select
          name="gender"
          className="border p-2 w-full"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          type="date"
          name="dob"
          className="border p-2 w-full"
          value={form.dob}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          className="border p-2 w-full"
          value={form.address}
          onChange={handleChange}
        />

        <select
          name="role"
          className="border p-2 w-full"
          value={form.role}
          onChange={handleChange}
        >
          <option value="bursar">Bursar</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="bg-green-500 text-white w-full p-2"
        >
          Create Admin
        </button>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  )
}