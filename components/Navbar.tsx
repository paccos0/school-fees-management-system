"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { LogOut, Settings, User, X } from "lucide-react"
import { toast } from "sonner"

interface NavbarProps {
  title: string
  userName?: string
  role?: string
}

type CurrentUser = {
  admin_id: number
  username: string
  first_name: string
  last_name: string
  role: string
}

export default function Navbar({ title, userName, role }: NavbarProps) {
  const router = useRouter()

  const [showSettings, setShowSettings] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    username: "",
  })

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })

  const loadProfile = async () => {
    try {
      setLoadingProfile(true)
      const res = await api.get("/auth/me")
      const user: CurrentUser = res.data

      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
      })
    } catch (error: any) {
      console.error("Failed to load profile", error)
      toast.error(error?.response?.data?.error || "Failed to load profile settings")
    } finally {
      setLoadingProfile(false)
    }
  }

  useEffect(() => {
    if (showSettings) {
      loadProfile()
    }
  }, [showSettings])

  const handleLogout = async () => {
    try {
      const res = await api.post("/auth/logout")
      toast.success(res.data?.message || "Logged out successfully")
      router.push("/login")
      router.refresh()
    } catch (error: any) {
      console.error("Logout failed", error)
      toast.error(error?.response?.data?.error || "Logout failed")
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !profileData.first_name.trim() ||
      !profileData.last_name.trim() ||
      !profileData.username.trim()
    ) {
      toast.error("All profile fields are required")
      return
    }

    try {
      setSavingProfile(true)

      const res = await api.put("/auth/profile", {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        username: profileData.username,
      })

      toast.success(res.data?.message || "Profile updated successfully")
      setShowSettings(false)
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.error || "Failed to update profile")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !passwordData.current_password ||
      !passwordData.new_password ||
      !passwordData.confirm_password
    ) {
      toast.error("All password fields are required")
      return
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New password and confirm password do not match")
      return
    }

    if (passwordData.new_password.length < 6) {
      toast.error("New password must be at least 6 characters")
      return
    }

    try {
      setSavingPassword(true)

      const res = await api.put("/auth/change-password", {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      })

      toast.success(res.data?.message || "Password changed successfully")

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.error || "Failed to change password")
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-sm text-slate-300">
              {userName
                ? `${userName} • ${role?.toUpperCase() || ""}`
                : "School Fees Management System"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {userName && (
              <div className="hidden items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-xl sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-white">
                  {userName?.charAt(0).toUpperCase()}
                </div>

                <div className="leading-tight">
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-slate-300">{role?.toUpperCase()}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>

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

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Update your profile details and password.
                </p>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="rounded-xl border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/15"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {loadingProfile ? (
              <div className="mt-6 text-sm text-slate-300">Loading profile...</div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <form
                  onSubmit={handleUpdateProfile}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-cyan-300" />
                    <h3 className="font-semibold text-white">Profile Info</h3>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={profileData.first_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          first_name: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-white/20 bg-white/85 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-cyan-500"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Last Name"
                      value={profileData.last_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          last_name: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-white/20 bg-white/85 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-cyan-500"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Username"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          username: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-white/20 bg-white/85 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-cyan-500"
                      required
                    />

                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="w-full rounded-xl border border-cyan-300/30 bg-cyan-500/90 px-4 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {savingProfile ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </form>

                <form
                  onSubmit={handleChangePassword}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-fuchsia-300" />
                    <h3 className="font-semibold text-white">Change Password</h3>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={passwordData.current_password}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          current_password: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-white/20 bg-white/85 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-fuchsia-500"
                      required
                    />

                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwordData.new_password}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          new_password: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-white/20 bg-white/85 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-fuchsia-500"
                      required
                    />

                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={passwordData.confirm_password}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirm_password: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-white/20 bg-white/85 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-fuchsia-500"
                      required
                    />

                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="w-full rounded-xl border border-fuchsia-300/30 bg-fuchsia-500/90 px-4 py-3 font-semibold text-white transition hover:bg-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {savingPassword ? "Updating..." : "Change Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}