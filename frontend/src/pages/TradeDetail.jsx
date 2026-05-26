import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Brain, LineChart, ShieldAlert } from 'lucide-react'
import api from '../api/axios'

function DetailBlock({ title, children }) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#0d121a] p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

function Item({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-200">{value || '-'}</p>
    </div>
  )
}

function TradeDetail() {
  const { id } = useParams()
  const [trade, setTrade] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const { data } = await api.get(`/trades/${id}`)
        setTrade(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this trade.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrade()
  }, [id])

  if (isLoading) {
    return <div className="rounded-lg border border-white/10 bg-[#0d121a] p-6">Loading trade...</div>
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link to="/trades" className="inline-flex items-center gap-2 text-sm text-cyan-300">
          <ArrowLeft size={16} />
          Back to trades
        </Link>
        <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-4 text-red-200">
          {error}
        </div>
      </div>
    )
  }

  const pnl = Number(trade.result?.pnl || 0)

  return (
    <div className="space-y-6">
      <Link to="/trades" className="inline-flex items-center gap-2 text-sm text-cyan-300">
        <ArrowLeft size={16} />
        Back to trades
      </Link>

      <section className="rounded-lg border border-white/10 bg-[#0d121a] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">{trade.basicInfo?.market}</p>
            <h2 className="text-3xl font-semibold text-white">{trade.basicInfo?.symbol}</h2>
            <p className="mt-2 text-sm text-slate-400">
              {trade.basicInfo?.direction} / {trade.basicInfo?.session} / {trade.basicInfo?.timeframe || 'No timeframe'}
            </p>
          </div>
          <div className={pnl >= 0 ? 'text-right text-emerald-300' : 'text-right text-red-300'}>
            <p className="text-sm text-slate-500">P&L</p>
            <p className="text-3xl font-semibold">{pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <DetailBlock title="Setup">
          <Item label="Setup" value={trade.setup?.setupName} />
          <Item label="Grade" value={trade.setup?.setupGrade} />
          <Item label="Condition" value={trade.setup?.marketCondition} />
          <Item label="HTF Bias" value={trade.setup?.higherTimeframeBias} />
          <div className="sm:col-span-2">
            <Item label="Entry Reason" value={trade.setup?.entryReason} />
          </div>
        </DetailBlock>

        <DetailBlock title="Risk">
          <Item label="Entry" value={trade.execution?.entryPrice} />
          <Item label="Exit" value={trade.execution?.exitPrice} />
          <Item label="Stop" value={trade.execution?.stopLoss} />
          <Item label="Take Profit" value={trade.execution?.takeProfit} />
          <Item
            label="Against Entry"
            value={
              trade.execution?.adversePriceMove !== undefined
                ? `${trade.execution.adversePriceMove}%`
                : ''
            }
          />
          <Item label="Risk Amount" value={trade.risk?.riskAmount} />
          <Item label="R Multiple" value={trade.risk?.rMultiple} />
        </DetailBlock>

        <DetailBlock title="Psychology">
          <Item label="Before" value={trade.psychology?.emotionBefore} />
          <Item label="During" value={trade.psychology?.emotionDuring} />
          <Item label="After" value={trade.psychology?.emotionAfter} />
          <Item label="Confidence" value={trade.psychology?.confidenceLevel} />
          <Item label="Discipline" value={trade.psychology?.disciplineScore} />
          <Item label="Stress" value={trade.psychology?.stressLevel} />
        </DetailBlock>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-[#0d121a] p-5 xl:col-span-2">
          <div className="flex items-center gap-2 text-white">
            <LineChart size={18} className="text-cyan-300" />
            <h2 className="text-lg font-semibold">Review</h2>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Item label="What Went Well" value={trade.review?.whatWentWell} />
            <Item label="What Went Wrong" value={trade.review?.whatWentWrong} />
            <Item label="Lesson Learned" value={trade.review?.lessonLearned} />
            <Item label="Improvement" value={trade.review?.improvement} />
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#0d121a] p-5">
          <div className="flex items-center gap-2 text-white">
            <ShieldAlert size={18} className="text-amber-300" />
            <h2 className="text-lg font-semibold">Mistakes</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>Rule broken: {trade.mistakes?.ruleBroken ? 'Yes' : 'No'}</p>
            <p>Followed plan: {trade.mistakes?.followedPlan ? 'Yes' : 'No'}</p>
            <p>Revenge trade: {trade.mistakes?.revengeTrade ? 'Yes' : 'No'}</p>
            <p>Mistakes: {trade.mistakes?.mistakesList?.join(', ') || '-'}</p>
          </div>
        </div>
      </div>

      <section className="rounded-lg border border-white/10 bg-[#0d121a] p-5">
        <div className="flex items-center gap-2 text-white">
          <Brain size={18} className="text-cyan-300" />
          <h2 className="text-lg font-semibold">Notes</h2>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">
          {trade.media?.notes || 'No notes added.'}
        </p>
      </section>
    </div>
  )
}

export default TradeDetail
