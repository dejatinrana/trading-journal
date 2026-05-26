import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-[#05070b] text-slate-200 lg:grid-cols-[1fr_520px]">
      <section className="hidden border-r border-white/10 bg-[#080b11] p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-sm font-bold text-cyan-200">
            TJ
          </div>
          <div>
            <p className="font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Trading Journal
            </p>
            <p className="text-sm text-slate-500">Private performance lab</p>
          </div>
        </div>

        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Forward testing desk
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight text-white">
            Improve the decision, then let P&L follow.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Log trades with risk, psychology, setup quality, execution details, and
            review notes built for disciplined repetition.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          {['Risk first', 'Plan based', 'Review driven'].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <TrendingUp size={18} className="text-cyan-300" />
              <p className="mt-3 text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-lg border border-white/10 bg-[#0d121a] p-6 shadow-2xl shadow-black/30"
        >
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">
            Welcome back
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Login</h2>
          <p className="mt-2 text-sm text-slate-400">
            Continue to your protected trading journal.
          </p>

          {error ? (
            <div className="mt-5 rounded-md border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <label className="mt-6 block">
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
                className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                placeholder="Your password"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-12 w-full rounded-md bg-cyan-300 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <p className="mt-5 text-center text-sm text-slate-400">
            Need an account?{' '}
            <Link className="font-medium text-cyan-300 hover:text-cyan-200" to="/signup">
              Sign up
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Login
