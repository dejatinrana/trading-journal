import { Link } from 'react-router-dom'
import { ArrowDownLeft, ArrowUpRight, Eye, Pencil, ShieldCheck } from 'lucide-react'

const resultStyles = {
  Win: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  Loss: 'border-red-400/25 bg-red-400/10 text-red-200',
  'Break Even': 'border-slate-400/25 bg-slate-400/10 text-slate-200',
  Open: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-200',
}

function TradeCard({ trade }) {
  const direction = trade.basicInfo?.direction || 'LONG'
  const isLong = direction === 'LONG'
  const pnl = Number(trade.result?.pnl || 0)
  const tradeId = trade._id || trade.id

  return (
    <article className="rounded-lg border border-white/10 bg-[#0d121a] p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-[#101722]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-md border p-2 ${
              isLong
                ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                : 'border-red-400/25 bg-red-400/10 text-red-200'
            }`}
          >
            {isLong ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
          </div>
          <div>
            <Link to={`/trades/${tradeId}`} className="text-lg font-semibold text-white hover:text-cyan-200">
              {trade.basicInfo?.symbol || 'Unknown Symbol'}
            </Link>
            <p className="text-sm text-slate-400">
              {direction} / {trade.basicInfo?.market || 'Market'} /{' '}
              {trade.basicInfo?.session || 'Session'}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            resultStyles[trade.result?.result] || resultStyles.Open
          }`}
        >
          {trade.result?.result || 'Open'}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
            P&L
          </p>
          <p className={pnl >= 0 ? 'text-emerald-300' : 'text-red-300'}>
            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
            R Multiple
          </p>
          <p className="text-slate-200">{trade.risk?.rMultiple ?? '-'}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
            Setup
          </p>
          <p className="text-slate-200">{trade.setup?.setupName || '-'}</p>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck size={16} className="text-cyan-300" />
          <span>{trade.psychology?.disciplineScore || '-'} / 10 discipline</span>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-white/10 pt-4">
        <Link
          to={`/trades/${tradeId}`}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-sm text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
        >
          <Eye size={16} />
          View
        </Link>
        {trade._id ? (
          <Link
            to={`/trades/${trade._id}/edit`}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-cyan-400/25 px-3 text-sm text-cyan-200 transition hover:bg-cyan-400/10"
          >
            <Pencil size={16} />
            Edit
          </Link>
        ) : null}
      </div>
    </article>
  )
}

export default TradeCard
