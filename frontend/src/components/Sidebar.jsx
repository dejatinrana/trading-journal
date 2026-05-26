import { useState } from 'react'
import {
  BarChart3,
  BookOpenCheck,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileSettingsModal from './ProfileSettingsModal'

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Trades', path: '/trades', icon: BookOpenCheck },
  { label: 'Add Trade', path: '/trades/new', icon: PlusCircle },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
]

function Sidebar() {
  const { logout, user } = useAuth()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
      <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-[#080b11]/95 px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:self-start lg:border-b-0 lg:border-r lg:px-5">
      <div className="flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-sm font-bold text-cyan-200">
          TJ
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Trading Journal
          </p>
          <p className="text-xs text-slate-500">Decision quality desk</p>
        </div>
      </div>

      <nav className="mt-6 grid gap-2 sm:grid-cols-4 lg:grid-cols-1">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-cyan-400/12 text-cyan-100 ring-1 ring-cyan-400/25'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4 lg:mt-auto">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-slate-800 text-sm font-semibold text-slate-100">
            {user?.name?.charAt(0)?.toUpperCase() || 'T'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user?.name || 'Trader'}
            </p>
            <p className="truncate text-xs text-slate-500">
              {user?.email || 'Local account'}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            <Settings size={16} />
            Settings
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-red-400/20 px-3 py-2 text-sm text-red-200 transition hover:bg-red-400/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
      </aside>
      {isSettingsOpen ? (
        <ProfileSettingsModal onClose={() => setIsSettingsOpen(false)} />
      ) : null}
    </>
  )
}

export default Sidebar
