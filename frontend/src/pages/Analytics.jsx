import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Brain,
  CandlestickChart,
  Clock3,
  Compass,
  Crosshair,
  LineChart as LineChartIcon,
  ShieldCheck,
  ShieldX,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import api from '../api/axios'
import StatCard from '../components/StatCard'

const chartColors = {
  amber: '#f59e0b',
  cyan: '#67e8f9',
  emerald: '#34d399',
  red: '#fb7185',
  slate: '#94a3b8',
  violet: '#a78bfa',
}

const tooltipStyle = {
  background: '#0d121a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  color: '#e5e7eb',
}

const number = (value) => Number(value || 0)

const average = (values) =>
  values.length
    ? values.reduce((total, value) => total + number(value), 0) / values.length
    : 0

const percent = (value) => `${number(value).toFixed(1)}%`
const money = (value) => `${number(value) >= 0 ? '+' : '-'}$${Math.abs(number(value)).toFixed(2)}`
const fixed = (value) => number(value).toFixed(2)

const parseHoldingHours = (value) => {
  if (!value) return 0

  const text = String(value).toLowerCase()
  const days = Number(text.match(/(\d+(\.\d+)?)\s*d/)?.[1] || 0)
  const hours = Number(text.match(/(\d+(\.\d+)?)\s*h/)?.[1] || 0)
  const minutes = Number(text.match(/(\d+(\.\d+)?)\s*m/)?.[1] || 0)

  if (days || hours || minutes) {
    return days * 24 + hours + minutes / 60
  }

  return Number.parseFloat(text) || 0
}

const sortedTrades = (trades) =>
  trades
    .slice()
    .sort(
      (a, b) =>
        new Date(a.basicInfo?.tradeDate || a.createdAt || 0) -
        new Date(b.basicInfo?.tradeDate || b.createdAt || 0),
    )

const buildCurve = (trades, getValue, key) =>
  sortedTrades(trades).reduce((curve, trade, index) => {
    const previous = curve[index - 1]?.[key] || 0
    const nextValue = previous + number(getValue(trade))

    return [
      ...curve,
      {
        name: `${index + 1}`,
        symbol: trade.basicInfo?.symbol || `Trade ${index + 1}`,
        [key]: Number(nextValue.toFixed(2)),
      },
    ]
  }, [])

const buildDrawdown = (equityCurve) =>
  equityCurve.reduce((points, point, index) => {
    const previousPeak = points[index - 1]?.peak ?? point.equity
    const peak = Math.max(previousPeak, point.equity)
    const drawdown = point.equity - peak

    return [
      ...points,
      {
        name: point.name,
        drawdown: Number(drawdown.toFixed(2)),
        peak,
      },
    ]
  }, [])

const performanceBy = (trades, getKey) => {
  const buckets = trades.reduce((map, trade) => {
    const key = getKey(trade) || 'Unknown'
    const current = map[key] || {
      count: 0,
      losses: 0,
      name: key,
      pnl: 0,
      rTotal: 0,
      wins: 0,
    }
    const result = trade.result?.result

    return {
      ...map,
      [key]: {
        ...current,
        count: current.count + 1,
        losses: current.losses + (result === 'Loss' ? 1 : 0),
        pnl: current.pnl + number(trade.result?.pnl),
        rTotal: current.rTotal + number(trade.risk?.rMultiple),
        wins: current.wins + (result === 'Win' ? 1 : 0),
      },
    }
  }, {})

  return Object.values(buckets)
    .map((item) => ({
      ...item,
      avgR: Number((item.rTotal / item.count).toFixed(2)),
      pnl: Number(item.pnl.toFixed(2)),
      winRate: Number(((item.wins / item.count) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.avgR - a.avgR)
}

const binaryPerformance = (trades, predicate, cleanLabel, flaggedLabel) =>
  performanceBy(trades, (trade) => (predicate(trade) ? flaggedLabel : cleanLabel))

const mistakeTimeline = (trades) =>
  sortedTrades(trades).map((trade, index) => ({
    name: `${index + 1}`,
    mistakes: trade.mistakes?.mistakesList?.length || 0,
    ruleBroken: trade.mistakes?.ruleBroken ? 1 : 0,
  }))

const stopLossQuality = (trades) =>
  trades
    .filter((trade) => trade.execution?.entryPrice && trade.execution?.stopLoss)
    .map((trade) => {
      const entry = number(trade.execution.entryPrice)
      const stop = number(trade.execution.stopLoss)
      const stopDistance = entry ? (Math.abs(entry - stop) / entry) * 100 : 0

      return {
        name: trade.basicInfo?.symbol || 'Trade',
        r: number(trade.risk?.rMultiple),
        stopDistance: Number(stopDistance.toFixed(2)),
      }
    })

const entryEfficiency = (trades) =>
  trades
    .filter((trade) => trade.execution?.adversePriceMove !== undefined)
    .map((trade) => ({
      adverseMove: number(trade.execution?.adversePriceMove),
      name: trade.basicInfo?.symbol || 'Trade',
      r: number(trade.risk?.rMultiple),
    }))

const holdingTimePerformance = (trades) =>
  trades
    .filter((trade) => trade.result?.holdingTime)
    .map((trade) => ({
      hours: Number(parseHoldingHours(trade.result?.holdingTime).toFixed(2)),
      name: trade.basicInfo?.symbol || 'Trade',
      pnl: number(trade.result?.pnl),
    }))

function ChartCard({ children, className = '', description, icon: Icon, title }) {
  return (
    <section className={`rounded-lg border border-white/10 bg-[#0d121a] p-5 shadow-2xl shadow-black/20 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
        {Icon ? (
          <div className="rounded-md border border-cyan-400/20 bg-cyan-400/10 p-2.5 text-cyan-200">
            <Icon size={18} />
          </div>
        ) : null}
      </div>
      <div className="mt-6 h-80 min-w-0">{children}</div>
    </section>
  )
}

function EmptyChart({ message }) {
  return (
    <div className="grid h-full place-items-center rounded-md border border-dashed border-white/10 bg-black/10 px-5 text-center text-sm text-slate-500">
      {message}
    </div>
  )
}

function PerformanceBarChart({ data, emptyMessage }) {
  if (!data.length) return <EmptyChart message={emptyMessage} />

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="left" stroke="#64748b" />
        <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
        <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => (name === 'winRate' ? percent(value) : value)} />
        <Legend />
        <Bar yAxisId="left" dataKey="avgR" name="Avg R" fill={chartColors.cyan} radius={[6, 6, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="winRate" name="Win Rate %" stroke={chartColors.emerald} strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

function Analytics() {
  const [trades, setTrades] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const { data } = await api.get('/trades')
        setTrades(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load analytics.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrades()
  }, [])

  const analytics = useMemo(() => {
    const closedTrades = trades.filter((trade) => trade.result?.result !== 'Open')
    const wins = closedTrades.filter((trade) => trade.result?.result === 'Win')
    const losses = closedTrades.filter((trade) => trade.result?.result === 'Loss')
    const equityCurve = buildCurve(trades, (trade) => trade.result?.pnl, 'equity')
    const rCurve = buildCurve(trades, (trade) => trade.risk?.rMultiple, 'rTotal')
    const avgWin = average(wins.map((trade) => trade.result?.pnl))
    const avgLoss = Math.abs(average(losses.map((trade) => trade.result?.pnl)))

    return {
      avgLoss,
      avgWin,
      drawdown: buildDrawdown(equityCurve),
      directionPerformance: performanceBy(trades, (trade) => trade.basicInfo?.direction),
      entryEfficiency: entryEfficiency(trades),
      equityCurve,
      followedPlan: binaryPerformance(
        trades,
        (trade) => !trade.mistakes?.followedPlan,
        'Followed Plan',
        'Did Not Follow',
      ),
      holdingTime: holdingTimePerformance(trades),
      marketConditionPerformance: performanceBy(trades, (trade) => trade.setup?.marketCondition),
      marketPerformance: performanceBy(trades, (trade) => trade.basicInfo?.market),
      mistakeTimeline: mistakeTimeline(trades),
      plannedVsActual: trades.map((trade, index) => ({
        actualRR: number(trade.risk?.actualRR),
        name: trade.basicInfo?.symbol || `${index + 1}`,
        plannedRR: number(trade.risk?.plannedRR),
      })),
      revengeTrade: binaryPerformance(
        trades,
        (trade) => trade.mistakes?.revengeTrade,
        'Normal Trades',
        'Revenge Trades',
      ),
      rCurve,
      ruleBreaks: binaryPerformance(
        trades,
        (trade) => trade.mistakes?.ruleBroken,
        'Clean Trades',
        'Rule Broken',
      ),
      sessionPerformance: performanceBy(trades, (trade) => trade.basicInfo?.session),
      setupPerformance: performanceBy(trades, (trade) => trade.setup?.setupName),
      stopLossQuality: stopLossQuality(trades),
      tradeGradePerformance: performanceBy(trades, (trade) => trade.review?.tradeGrade),
      winLoss: [
        { name: 'Win Rate %', value: closedTrades.length ? (wins.length / closedTrades.length) * 100 : 0 },
        { name: 'Avg Win $', value: avgWin },
        { name: 'Avg Loss $', value: avgLoss },
      ],
      winRate: closedTrades.length ? (wins.length / closedTrades.length) * 100 : 0,
    }
  }, [trades])

  if (isLoading) {
    return <div className="rounded-lg border border-white/10 bg-[#0d121a] p-6">Loading analytics...</div>
  }

  if (error) {
    return <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-4 text-red-200">{error}</div>
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Target} label="Win Rate" value={percent(analytics.winRate)} helper={`${trades.length} trades in journal`} tone="blue" />
        <StatCard icon={TrendingUp} label="Avg Win" value={money(analytics.avgWin)} helper="Average winning trade" tone="green" />
        <StatCard icon={TrendingDown} label="Avg Loss" value={`-$${analytics.avgLoss.toFixed(2)}`} helper="Average losing trade" tone="red" />
        <StatCard icon={ShieldX} label="Rule Breaks" value={analytics.ruleBreaks.find((item) => item.name === 'Rule Broken')?.count || 0} helper="Trades where process was violated" tone="amber" />
      </section>

      {trades.length ? (
        <section className="grid gap-6 xl:grid-cols-2">
          <ChartCard title="Equity Curve" description="Cumulative P&L across your trade sequence." icon={LineChartIcon}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.equityCurve}>
                <defs>
                  <linearGradient id="equityFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.cyan} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={chartColors.cyan} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => money(value)} />
                <ReferenceLine y={0} stroke="#475569" />
                <Area type="monotone" dataKey="equity" stroke={chartColors.cyan} fill="url(#equityFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="R-Multiple Curve" description="Cumulative R, normalized by risk instead of account size." icon={Activity}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.rCurve}>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${fixed(value)}R`} />
                <ReferenceLine y={0} stroke="#475569" />
                <Line type="monotone" dataKey="rTotal" name="Cumulative R" stroke={chartColors.emerald} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Win Rate vs Average Win/Loss" description="Shows whether your payoff profile supports the win rate." icon={Target}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.winLoss}>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => (name === 'value' ? fixed(value) : value)} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {analytics.winLoss.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.name.includes('Loss') ? chartColors.red : item.name.includes('Win Rate') ? chartColors.cyan : chartColors.emerald}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Drawdown Chart" description="Peak-to-valley damage control across the equity curve." icon={TrendingDown}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.drawdown}>
                <defs>
                  <linearGradient id="drawdownFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.red} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColors.red} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => money(value)} />
                <ReferenceLine y={0} stroke="#475569" />
                <Area type="monotone" dataKey="drawdown" stroke={chartColors.red} fill="url(#drawdownFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Setup Performance" description="Avg R and win rate by setup." icon={Award}>
            <PerformanceBarChart data={analytics.setupPerformance} emptyMessage="Add setup names to unlock this chart." />
          </ChartCard>

          <ChartCard title="Session Performance" description="Which session produces the cleanest edge." icon={Clock3}>
            <PerformanceBarChart data={analytics.sessionPerformance} emptyMessage="Add session data to unlock this chart." />
          </ChartCard>

          <ChartCard title="Market Performance" description="Crypto, forex, stocks, indexes, and commodities by Avg R." icon={CandlestickChart}>
            <PerformanceBarChart data={analytics.marketPerformance} emptyMessage="Add market data to unlock this chart." />
          </ChartCard>

          <ChartCard title="Direction Performance" description="LONG vs SHORT performance profile." icon={Compass}>
            <PerformanceBarChart data={analytics.directionPerformance} emptyMessage="Add direction data to unlock this chart." />
          </ChartCard>

          <ChartCard title="Rule-Broken vs Clean Trades" description="The cost of breaking process rules." icon={ShieldX}>
            <PerformanceBarChart data={analytics.ruleBreaks} emptyMessage="Rule discipline data will appear here." />
          </ChartCard>

          <ChartCard title="Planned RR vs Actual RR" description="Shows whether winners are being cut or plans are being executed." icon={Crosshair}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={analytics.plannedVsActual}>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${fixed(value)}R`} />
                <Legend />
                <Bar dataKey="plannedRR" name="Planned RR" fill={chartColors.slate} radius={[6, 6, 0, 0]} />
                <Line type="monotone" dataKey="actualRR" name="Actual RR" stroke={chartColors.cyan} strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Entry Efficiency" description="Against Entry % compared with final R." icon={Target}>
            {analytics.entryEfficiency.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                  <XAxis dataKey="adverseMove" name="Against Entry" stroke="#64748b" unit="%" />
                  <YAxis dataKey="r" name="R" stroke="#64748b" unit="R" />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
                  <ReferenceLine y={0} stroke="#475569" />
                  <Scatter data={analytics.entryEfficiency} fill={chartColors.cyan} />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="Add Against Entry % values to measure entry timing." />
            )}
          </ChartCard>

          <ChartCard title="Stop Loss Quality" description="Stop distance % compared with final R." icon={ShieldCheck}>
            {analytics.stopLossQuality.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                  <XAxis dataKey="stopDistance" name="Stop Distance" stroke="#64748b" unit="%" />
                  <YAxis dataKey="r" name="R" stroke="#64748b" unit="R" />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
                  <ReferenceLine y={0} stroke="#475569" />
                  <Scatter data={analytics.stopLossQuality} fill={chartColors.emerald} />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="Add entry and stop-loss prices to measure stop quality." />
            )}
          </ChartCard>

          <ChartCard title="Holding Time vs P&L" description="Find whether longer trades improve or damage results." icon={Clock3}>
            {analytics.holdingTime.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                  <XAxis dataKey="hours" name="Hours Held" stroke="#64748b" unit="h" />
                  <YAxis dataKey="pnl" name="P&L" stroke="#64748b" />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => (name === 'pnl' ? money(value) : value)} />
                  <ReferenceLine y={0} stroke="#475569" />
                  <Scatter data={analytics.holdingTime} fill={chartColors.violet} />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="Add holding time values like 2h 15m to unlock this chart." />
            )}
          </ChartCard>

          <ChartCard title="Mistake Frequency Over Time" description="Shows whether process leaks are shrinking as sample size grows." icon={AlertTriangle}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={analytics.mistakeTimeline}>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="mistakes" name="Mistakes" fill={chartColors.amber} radius={[6, 6, 0, 0]} />
                <Line type="monotone" dataKey="ruleBroken" name="Rule Broken" stroke={chartColors.red} strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Revenge Trade Performance" description="Separates emotional trades from normal execution." icon={Brain}>
            <PerformanceBarChart data={analytics.revengeTrade} emptyMessage="Revenge trade labels will appear here." />
          </ChartCard>

          <ChartCard title="Followed Plan vs Did Not Follow Plan" description="Measures the value of process compliance." icon={ShieldCheck}>
            <PerformanceBarChart data={analytics.followedPlan} emptyMessage="Plan-following data will appear here." />
          </ChartCard>

          <ChartCard title="Trade Grade Performance" description="A+ through D trades by Avg R and win rate." icon={Award}>
            <PerformanceBarChart data={analytics.tradeGradePerformance} emptyMessage="Add trade grades to unlock this chart." />
          </ChartCard>

          <ChartCard title="Market Condition Performance" description="Trending, range, breakout, reversal, and choppy conditions." icon={BarChart3}>
            <PerformanceBarChart data={analytics.marketConditionPerformance} emptyMessage="Add market condition data to unlock this chart." />
          </ChartCard>
        </section>
      ) : (
        <div className="rounded-lg border border-white/10 bg-[#0d121a] p-8 text-center">
          <h2 className="text-xl font-semibold text-white">Analytics will unlock after trades are logged</h2>
          <p className="mt-2 text-sm text-slate-400">
            Add trades with setup, risk, result, and psychology data to see the dashboards fill in.
          </p>
        </div>
      )}
    </div>
  )
}

export default Analytics
