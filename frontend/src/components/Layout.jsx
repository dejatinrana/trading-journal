import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const pageMeta = {
  '/': {
    title: 'Dashboard',
    description: 'Track execution quality, risk, and psychology in one command center.',
  },
  '/trades': {
    title: 'Trades',
    description: 'Review every forward-test trade with setup, R, and discipline context.',
  },
  '/trades/new': {
    title: 'Add Trade',
    description: 'Log the trade thesis, execution, risk, emotions, and post-trade review.',
  },
  '/trades/edit': {
    title: 'Edit Trade',
    description: 'Update execution, risk, psychology, and review details for this trade.',
  },
  '/analytics': {
    title: 'Analytics',
    description: 'Find patterns in P&L, sessions, setups, mistakes, and behavior.',
  },
}

function Layout() {
  const location = useLocation()
  const isEditPage = location.pathname.endsWith('/edit')
  const meta =
    pageMeta[isEditPage ? '/trades/edit' : location.pathname] || {
      title: 'Trade Detail',
      description: 'Inspect the full trade record and decision-quality notes.',
    }

  return (
    <div className="min-h-screen bg-[#05070b] text-slate-200 lg:flex lg:h-screen lg:overflow-hidden">
      <Sidebar />
      <main className="min-w-0 flex-1 lg:h-screen lg:overflow-y-auto">
        <div className="border-b border-white/10 bg-[#080b11]/75 px-5 py-5 backdrop-blur md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Private journal
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
            {meta.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            {meta.description}
          </p>
        </div>
        <div className="px-5 py-6 md:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
