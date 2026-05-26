import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  Brain,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Scale,
  Target,
  Trophy,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import api from '../api/axios'
import StatCard from '../components/StatCard'
import TradeCard from '../components/TradeCard'

const mockTrades = [
  {
    id: 'mock-1',
    basicInfo: {
      symbol: 'BTCUSDT',
      market: 'Crypto',
      direction: 'LONG',
      session: 'New York',
      tradeDate: '2026-05-24',
    },
    setup: { setupName: 'Breakout Retest', setupGrade: 'A' },
    risk: { rMultiple: 2.4 },
    result: { pnl: 420, result: 'Win' },
    psychology: { disciplineScore: 9 },
    mistakes: { ruleBroken: false, mistakesList: [] },
  },
  {
    id: 'mock-2',
    basicInfo: {
      symbol: 'EURUSD',
      market: 'Forex',
      direction: 'SHORT',
      session: 'London',
      tradeDate: '2026-05-23',
    },
    setup: { setupName: 'Liquidity Sweep', setupGrade: 'B' },
    risk: { rMultiple: -1 },
    result: { pnl: -160, result: 'Loss' },
    psychology: { disciplineScore: 6 },
    mistakes: { ruleBroken: true, mistakesList: ['Moved stop'] },
  },
  {
    id: 'mock-3',
    basicInfo: {
      symbol: 'ETHUSDT',
      market: 'Crypto',
      direction: 'LONG',
      session: 'Overlap',
      tradeDate: '2026-05-22',
    },
    setup: { setupName: 'Trend Continuation', setupGrade: 'A+' },
    risk: { rMultiple: 1.6 },
    result: { pnl: 280, result: 'Win' },
    psychology: { disciplineScore: 8 },
    mistakes: { ruleBroken: false, mistakesList: [] },
  },
]

const sum = (values) => values.reduce((total, value) => total + value, 0)
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const formatDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getTradeDate = (trade) => {
  const rawDate = trade.basicInfo?.tradeDate || trade.createdAt
  return rawDate ? new Date(rawDate) : null
}

function buildYearCalendar(year) {
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const firstDay = new Date(year, monthIndex, 1)
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    const leadingBlanks = firstDay.getDay()
    const cells = [
      ...Array.from({ length: leadingBlanks }, (_, index) => ({
        key: `blank-${monthIndex}-${index}`,
        isBlank: true,
      })),
      ...Array.from({ length: daysInMonth }, (_, index) => {
        const date = new Date(year, monthIndex, index + 1)
        return {
          date,
          day: index + 1,
          key: formatDateKey(date),
        }
      }),
    ]

    return {
      cells,
      monthIndex,
      name: monthNames[monthIndex],
    }
  })
}

function buildDailyTradeMap(trades) {
  return trades.reduce((map, trade) => {
    const date = getTradeDate(trade)
    if (!date || Number.isNaN(date.getTime())) return map

    const key = formatDateKey(date)
    const previous = map[key] || { count: 0, pnl: 0 }

    return {
      ...map,
      [key]: {
        count: previous.count + 1,
        pnl: previous.pnl + Number(trade.result?.pnl || 0),
      },
    }
  }, {})
}

function TradingCalendar({ dailyTrades, selectedYear, setSelectedYear }) {
  const months = useMemo(() => buildYearCalendar(selectedYear), [selectedYear])
  const currentYear = new Date().getFullYear()

  return (
    <section className="rounded-lg border border-white/10 bg-[#0d121a] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-md border border-cyan-400/20 bg-cyan-400/10 p-2.5 text-cyan-200">
            <CalendarDays size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Trading Calendar</h2>
            <p className="text-sm text-slate-400">
              Daily trade activity and net P&L for the selected year.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedYear((year) => year - 1)}
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
            aria-label="Previous year"
          >
            <ChevronLeft size={17} />
          </button>
          <input
            type="number"
            value={selectedYear}
            onChange={(event) => setSelectedYear(Number(event.target.value) || currentYear)}
            className="h-9 w-24 rounded-md border border-white/10 bg-black/20 px-3 text-center text-sm font-semibold text-white outline-none focus:border-cyan-400/50"
          />
          <button
            type="button"
            onClick={() => setSelectedYear((year) => year + 1)}
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
            aria-label="Next year"
          >
            <ChevronRight size={17} />
          </button>
          <button
            type="button"
            onClick={() => setSelectedYear(currentYear)}
            className="h-9 rounded-md border border-cyan-400/25 px-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/10"
          >
            Current
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-xs">
        <span className="inline-flex items-center gap-2 text-slate-400">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" />
          Profitable day
        </span>
        <span className="inline-flex items-center gap-2 text-slate-400">
          <span className="h-2.5 w-2.5 rounded-sm bg-red-400" />
          Losing day
        </span>
        <span className="inline-flex items-center gap-2 text-slate-400">
          <span className="h-2.5 w-2.5 rounded-sm bg-slate-500" />
          Break-even day
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {months.map((month) => (
          <div key={month.name} className="rounded-lg border border-white/10 bg-black/15 p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-white">{month.name}</h3>
              <span className="text-xs text-slate-500">{selectedYear}</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-slate-500">
              {weekDays.map((day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {month.cells.map((cell) => {
                if (cell.isBlank) {
                  return <div key={cell.key} className="aspect-square rounded-md" />
                }

                const daily = dailyTrades[cell.key]
                const pnl = daily?.pnl || 0
                const hasTrade = Boolean(daily)
                const tone =
                  pnl > 0
                    ? 'border-emerald-400/30 bg-emerald-400/15 text-emerald-100'
                    : pnl < 0
                      ? 'border-red-400/30 bg-red-400/15 text-red-100'
                      : hasTrade
                        ? 'border-slate-400/25 bg-slate-400/10 text-slate-100'
                        : 'border-white/5 bg-white/[0.02] text-slate-500'

                return (
                  <div
                    key={cell.key}
                    title={
                      hasTrade
                        ? `${daily.count} trade${daily.count > 1 ? 's' : ''}, ${pnl >= 0 ? '+' : '-'}$${Math.abs(pnl).toFixed(2)}`
                        : undefined
                    }
                    className={`flex aspect-square min-h-12 flex-col items-center justify-center rounded-md border p-1 ${tone}`}
                  >
                    <span className="text-xs font-semibold">{cell.day}</span>
                    {hasTrade ? (
                      <span className="mt-0.5 max-w-full truncate text-[10px] font-semibold leading-none">
                        {pnl >= 0 ? '+' : '-'}${Math.abs(pnl).toFixed(0)}
                      </span>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function buildStats(trades) {
  const closedTrades = trades.filter((trade) => trade.result?.result !== 'Open')
  const wins = closedTrades.filter((trade) => trade.result?.result === 'Win')
  const losses = closedTrades.filter((trade) => trade.result?.result === 'Loss')
  const grossProfit = sum(wins.map((trade) => Number(trade.result?.pnl || 0)))
  const grossLoss = Math.abs(sum(losses.map((trade) => Number(trade.result?.pnl || 0))))
  const totalPnl = sum(trades.map((trade) => Number(trade.result?.pnl || 0)))
  const ruleBreaks = trades.filter((trade) => trade.mistakes?.ruleBroken).length
  const rValues = trades.map((trade) => Number(trade.risk?.rMultiple || 0))

  return {
    averageR: rValues.length ? sum(rValues) / rValues.length : 0,
    netPnl: totalPnl,
    profitFactor: grossLoss ? grossProfit / grossLoss : grossProfit ? grossProfit : 0,
    ruleBreaks,
    totalTrades: trades.length,
    winRate: closedTrades.length ? (wins.length / closedTrades.length) * 100 : 0,
  }
}

function buildEquityCurve(trades) {
  let equity = 0
  return trades
    .slice()
    .reverse()
    .map((trade, index) => {
      equity += Number(trade.result?.pnl || 0)
      return {
        name: trade.basicInfo?.symbol || `T${index + 1}`,
        equity,
      }
    })
}

function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [trades, setTrades] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const { data } = await api.get('/trades')
        setTrades(data.length ? data : mockTrades)
        setUsingMockData(!data.length)
      } catch {
        setTrades(mockTrades)
        setUsingMockData(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrades()
  }, [])

  const stats = useMemo(() => buildStats(trades), [trades])
  const dailyTrades = useMemo(() => buildDailyTradeMap(trades), [trades])
  const equityCurve = useMemo(() => buildEquityCurve(trades), [trades])
  const setupData = useMemo(
    () =>
      trades.slice(0, 5).map((trade) => ({
        name: trade.setup?.setupName || trade.basicInfo?.symbol || 'Setup',
        r: Number(trade.risk?.rMultiple || 0),
      })),
    [trades],
  )

  if (isLoading) {
    return <div className="rounded-lg border border-white/10 bg-[#0d121a] p-6">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      {usingMockData ? (
        <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Showing starter analytics until your first backend trades are logged.
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Target}
          label="Net P&L"
          value={`${stats.netPnl >= 0 ? '+' : '-'}$${Math.abs(stats.netPnl).toFixed(2)}`}
          helper="Realized performance from logged trades"
          tone={stats.netPnl >= 0 ? 'green' : 'red'}
        />
        <StatCard
          icon={Trophy}
          label="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          helper={`${stats.totalTrades} total trades`}
          tone="blue"
        />
        <StatCard
          icon={Scale}
          label="Profit Factor"
          value={stats.profitFactor.toFixed(2)}
          helper="Gross wins divided by gross losses"
          tone="green"
        />
        <StatCard
          icon={AlertTriangle}
          label="Rule Breaks"
          value={stats.ruleBreaks}
          helper="Execution mistakes that damaged process quality"
          tone="amber"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-lg border border-white/10 bg-[#0d121a] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Equity Curve</h2>
              <p className="text-sm text-slate-400">Cumulative P&L from logged trades</p>
            </div>
            <BarChart3 size={20} className="text-cyan-300" />
          </div>
          <div className="mt-6 h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityCurve}>
                <defs>
                  <linearGradient id="equity" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#67e8f9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    background: '#0d121a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                  }}
                />
                <Area dataKey="equity" stroke="#67e8f9" fill="url(#equity)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#0d121a] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Setup Quality</h2>
              <p className="text-sm text-slate-400">Recent R multiples by playbook setup</p>
            </div>
            <Brain size={20} className="text-cyan-300" />
          </div>
          <div className="mt-6 h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={setupData}>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    background: '#0d121a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="r" fill="#67e8f9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <TradingCalendar
        dailyTrades={dailyTrades}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Trades</h2>
            <p className="text-sm text-slate-400">Latest entries with process quality signals</p>
          </div>
        </div>
        <div className="grid gap-4">
          {trades.slice(0, 3).map((trade) => (
            <TradeCard key={trade._id || trade.id} trade={trade} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
