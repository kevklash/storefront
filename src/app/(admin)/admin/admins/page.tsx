"use client"

import { useState, useEffect } from "react"
import { UserPlus, KeyRound } from "lucide-react"
import Button from "@/components/ui/Button"

type AdminUser = {
  _id: string
  name: string
  email: string
  createdAt: string
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  const [showCreate, setShowCreate]     = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [createSaving, setCreateSaving]   = useState(false)
  const [createError, setCreateError]     = useState("")
  const [createSuccess, setCreateSuccess] = useState("")
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", confirm: "" })

  const [pwSaving, setPwSaving]   = useState(false)
  const [pwError, setPwError]     = useState("")
  const [pwSuccess, setPwSuccess] = useState("")
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" })

  useEffect(() => { fetchAdmins() }, [])

  async function fetchAdmins() {
    try {
      const res = await fetch("/api/admin/users")
      setAdmins(await res.json() as AdminUser[])
    } catch {
      setCreateError("Failed to load admins")
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreateError("")
    setCreateSuccess("")
    if (createForm.password !== createForm.confirm) return setCreateError("Passwords do not match")
    if (createForm.password.length < 8) return setCreateError("Password must be at least 8 characters")
    setCreateSaving(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createForm.name, email: createForm.email, password: createForm.password }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) throw new Error(data.error ?? "Failed to create admin")
      setCreateSuccess(`Admin "${createForm.name}" created successfully`)
      setCreateForm({ name: "", email: "", password: "", confirm: "" })
      setShowCreate(false)
      fetchAdmins()
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create admin")
    } finally {
      setCreateSaving(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwError("")
    setPwSuccess("")
    if (pwForm.next !== pwForm.confirm) return setPwError("Passwords do not match")
    if (pwForm.next.length < 8) return setPwError("New password must be at least 8 characters")
    setPwSaving(true)
    try {
      const res = await fetch("/api/admin/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) throw new Error(data.error ?? "Failed to update password")
      setPwSuccess("Password updated successfully")
      setPwForm({ current: "", next: "", confirm: "" })
      setShowPassword(false)
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Failed to update password")
    } finally {
      setPwSaving(false)
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-black">Admin Users</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => { setShowPassword(!showPassword); setPwError(""); setPwSuccess("") }}
            variant="secondary"
            size="sm"
          >
            <KeyRound size={14} className="mr-1.5" />
            Change Password
          </Button>
          <Button
            onClick={() => { setShowCreate(!showCreate); setCreateError(""); setCreateSuccess("") }}
            variant="primary"
            size="sm"
          >
            <UserPlus size={15} className="mr-1.5" />
            New Admin
          </Button>
        </div>
      </div>

      {createError   && <p className="text-red-600 text-sm bg-red-50 p-3 rounded mb-4">{createError}</p>}
      {createSuccess && <p className="text-green-600 text-sm bg-green-50 p-3 rounded mb-4">{createSuccess}</p>}
      {pwError   && <p className="text-red-600 text-sm bg-red-50 p-3 rounded mb-4">{pwError}</p>}
      {pwSuccess && <p className="text-green-600 text-sm bg-green-50 p-3 rounded mb-4">{pwSuccess}</p>}

      {/* Change password form */}
      {showPassword && (
        <form onSubmit={handleChangePassword} className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-4">
          <h2 className="text-sm font-semibold text-black">Change My Password</h2>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Current Password</label>
            <input
              required
              type="password"
              value={pwForm.current}
              onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
              placeholder="Your current password"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">New Password</label>
              <input
                required
                type="password"
                value={pwForm.next}
                onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                placeholder="Min. 8 characters"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Confirm New Password</label>
              <input
                required
                type="password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                placeholder="Repeat new password"
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="submit" loading={pwSaving}>Update Password</Button>
            <Button type="button" variant="secondary" onClick={() => { setShowPassword(false); setPwError("") }}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Create admin form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-4">
          <h2 className="text-sm font-semibold text-black">Create New Admin</h2>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Name</label>
            <input
              required
              value={createForm.name}
              onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Jane Doe"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Email</label>
            <input
              required
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="jane@example.com"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Password</label>
              <input
                required
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Min. 8 characters"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Confirm Password</label>
              <input
                required
                type="password"
                value={createForm.confirm}
                onChange={(e) => setCreateForm((f) => ({ ...f, confirm: e.target.value }))}
                placeholder="Repeat password"
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="submit" loading={createSaving}>Create Admin</Button>
            <Button type="button" variant="secondary" onClick={() => { setShowCreate(false); setCreateError("") }}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Admins table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : admins.length === 0 ? (
          <p className="text-sm text-gray-500 p-5">No admin users yet. Create one above.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500">
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-black">{admin.name}</td>
                  <td className="px-5 py-3 text-gray-600">{admin.email}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
