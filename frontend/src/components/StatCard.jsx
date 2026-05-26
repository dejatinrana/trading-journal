function StatCard({ icon: Icon, label, value, helper, tone = 'default' }) {
  const tones = {
    default: 'border-white/10 bg-white/[0.04] text-white',
    green: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
    red: 'border-red-400/20 bg-red-400/10 text-red-200',
    amber: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
    blue: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200',
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#0d121a] p-5 shadow-2xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
        </div>
        {Icon ? (
          <div className={`rounded-md border p-2.5 ${tones[tone]}`}>
            <Icon size={18} />
          </div>
        ) : null}
      </div>
      {helper ? <p className="mt-4 text-sm text-slate-400">{helper}</p> : null}
    </div>
  )
}

export default StatCard
