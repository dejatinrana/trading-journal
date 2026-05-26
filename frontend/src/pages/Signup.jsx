import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Signup() {
  const { isAuthenticated, signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await signup(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try another email.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070b] px-5 py-10 text-slate-200">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-white/10 bg-[#0d121a] p-6 shadow-2xl shadow-black/30"
      >
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">
          Create your journal
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Signup</h1>
        <p className="mt-2 text-sm text-slate-400">
          Start logging trades with risk, psychology, and review discipline.
        </p>

        {error ? (
          <div className="mt-5 rounded-md border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <label className="mt-6 block">
          <span className="text-sm text-slate-300">Name</span>
          <div className="mt-2 flex items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3">
            <User size={18} className="text-slate-500" />
            <input
              type="text"
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
          <div className="mt-2 flex items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3">
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
          <span className="text-sm text-slate-300">Password</span>
          <div className="mt-2 flex items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3">
            <LockKeyhole size={18} className="text-slate-500" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={updateField}
              required
              minLength={6}
              className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-600"
              placeholder="At least 6 characters"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 h-12 w-full rounded-md bg-cyan-300 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="mt-5 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link className="font-medium text-cyan-300 hover:text-cyan-200" to="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  )
}

export default Signup
