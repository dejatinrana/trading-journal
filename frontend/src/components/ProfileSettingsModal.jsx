import { useState } from 'react'
import { Mail, Save, User, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function ProfileSettingsModal({ onClose }) {
  const { updateProfile, user } = useAuth()
  const [form, setForm] = useState({
    email: user?.email || '',
    name: user?.name || '',
    password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      const payload = {
        email: form.email,
        name: form.name,
      }

      if (form.password) {
        payload.password = form.password
      }

      await updateProfile(payload)
      setForm((current) => ({ ...current, password: '' }))
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-lg border border-white/10 bg-[#0d121a] p-5 shadow-2xl shadow-black/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Settings
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Update Profile</h2>
            <p className="mt-1 text-sm text-slate-400">
              Edit your journal identity and optional login password.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        {error ? (
          <div className="mt-5 rounded-md border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-5 rounded-md border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        <label className="mt-6 block">
          <span className="text-sm text-slate-300">Name</span>
          <div className="mt-2 flex items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3 focus-within:border-cyan-400/50">
            <User size={18} className="text-slate-500" />
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              required
              className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-600"
              placeholder="Your name"
            />
          </div>
        </label>

        <label className="mt-4 block">
          <span className="text-sm text-slate-300">Email</span>
          <div className="mt-2 flex items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3 focus-within:border-cyan-400/50">
            <Mail size={18} className="text-slate-500" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              required
              className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-600"
              placeholder="you@example.com"
            />
          </div>
        </label>

        <label className="mt-4 block">
          <span className="text-sm text-slate-300">New Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={updateField}
            minLength={6}
            className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black/20 px-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
            placeholder="Leave blank to keep current password"
          />
        </label>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-md border border-white/10 px-4 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileSettingsModal
