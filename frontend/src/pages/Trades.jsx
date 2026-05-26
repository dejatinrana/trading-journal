import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Search } from 'lucide-react'
import api from '../api/axios'
import TradeCard from '../components/TradeCard'

function Trades() {
  const [trades, setTrades] = useState([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const { data } = await api.get('/trades')
        setTrades(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load trades.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrades()
  }, [])

  const filteredTrades = trades.filter((trade) => {
    const symbol = trade.basicInfo?.symbol || ''
    const setup = trade.setup?.setupName || ''
    return `${symbol} ${setup}`.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-md items-center gap-3 rounded-md border border-white/10 bg-[#0d121a] px-3">
          <Search size={18} className="text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
            placeholder="Search symbol or setup"
          />
        </div>
        <Link
          to="/trades/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
        >
          <PlusCircle size={18} />
          Add Trade
        </Link>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-4 text-red-200">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-white/10 bg-[#0d121a] p-6">Loading trades...</div>
      ) : filteredTrades.length ? (
        <div className="grid gap-4">
          {filteredTrades.map((trade) => (
            <TradeCard key={trade._id} trade={trade} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-[#0d121a] p-8 text-center">
          <h2 className="text-xl font-semibold text-white">No trades logged yet</h2>
          <p className="mt-2 text-sm text-slate-400">
            Add your first forward-test trade to start building useful statistics.
          </p>
        </div>
      )}
    </div>
  )
}

export default Trades
