import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save } from 'lucide-react'
import api from '../api/axios'

const initialForm = {
  symbol: '',
  market: 'Crypto',
  direction: 'LONG',
  tradeDate: '',
  session: 'New York',
  timeframe: '',
  strategy: '',
  setupName: '',
  setupGrade: 'A',
  marketCondition: 'Trending',
  higherTimeframeBias: 'Neutral',
  confluences: '',
  entryReason: '',
  entryPrice: '',
  exitPrice: '',
  stopLoss: '',
  takeProfit: '',
  quantity: '',
  leverage: 1,
  fees: 0,
  adversePriceMove: '',
  accountBalanceBefore: '',
  riskAmount: '',
  riskPercent: '',
  plannedRR: '',
  actualRR: '',
  rMultiple: '',
  pnl: '',
  pnlPercent: '',
  result: 'Open',
  holdingTime: '',
  emotionBefore: '',
  emotionDuring: '',
  emotionAfter: '',
  confidenceLevel: 7,
  disciplineScore: 8,
  stressLevel: 4,
  mistakesList: '',
  ruleBroken: false,
  followedPlan: true,
  revengeTrade: false,
  whatWentWell: '',
  whatWentWrong: '',
  lessonLearned: '',
  improvement: '',
  tradeGrade: 'A',
  beforeScreenshot: '',
  afterScreenshot: '',
  notes: '',
}

const numberOrUndefined = (value) => (value === '' ? undefined : Number(value))

const formatDateForInput = (date) => {
  if (!date) return ''
  return new Date(date).toISOString().slice(0, 10)
}

const valueOrEmpty = (value) => value ?? ''

const openDatePicker = (event) => {
  try {
    event.currentTarget.showPicker?.()
  } catch {
    // Some browsers only allow the picker during direct pointer activation.
  }
}

const tradeToForm = (trade) => ({
  ...initialForm,
  symbol: valueOrEmpty(trade.basicInfo?.symbol),
  market: trade.basicInfo?.market || initialForm.market,
  direction: trade.basicInfo?.direction || initialForm.direction,
  tradeDate: formatDateForInput(trade.basicInfo?.tradeDate),
  session: trade.basicInfo?.session || initialForm.session,
  timeframe: valueOrEmpty(trade.basicInfo?.timeframe),
  strategy: valueOrEmpty(trade.basicInfo?.strategy),
  setupName: valueOrEmpty(trade.setup?.setupName),
  setupGrade: trade.setup?.setupGrade || initialForm.setupGrade,
  marketCondition: trade.setup?.marketCondition || initialForm.marketCondition,
  higherTimeframeBias: trade.setup?.higherTimeframeBias || initialForm.higherTimeframeBias,
  confluences: trade.setup?.confluences?.join(', ') || '',
  entryReason: valueOrEmpty(trade.setup?.entryReason),
  entryPrice: valueOrEmpty(trade.execution?.entryPrice),
  exitPrice: valueOrEmpty(trade.execution?.exitPrice),
  stopLoss: valueOrEmpty(trade.execution?.stopLoss),
  takeProfit: valueOrEmpty(trade.execution?.takeProfit),
  quantity: valueOrEmpty(trade.execution?.quantity),
  leverage: valueOrEmpty(trade.execution?.leverage),
  fees: valueOrEmpty(trade.execution?.fees),
  adversePriceMove: valueOrEmpty(trade.execution?.adversePriceMove),
  accountBalanceBefore: valueOrEmpty(trade.risk?.accountBalanceBefore),
  riskAmount: valueOrEmpty(trade.risk?.riskAmount),
  riskPercent: valueOrEmpty(trade.risk?.riskPercent),
  plannedRR: valueOrEmpty(trade.risk?.plannedRR),
  actualRR: valueOrEmpty(trade.risk?.actualRR),
  rMultiple: valueOrEmpty(trade.risk?.rMultiple),
  pnl: valueOrEmpty(trade.result?.pnl),
  pnlPercent: valueOrEmpty(trade.result?.pnlPercent),
  result: trade.result?.result || initialForm.result,
  holdingTime: valueOrEmpty(trade.result?.holdingTime),
  emotionBefore: valueOrEmpty(trade.psychology?.emotionBefore),
  emotionDuring: valueOrEmpty(trade.psychology?.emotionDuring),
  emotionAfter: valueOrEmpty(trade.psychology?.emotionAfter),
  confidenceLevel: valueOrEmpty(trade.psychology?.confidenceLevel),
  disciplineScore: valueOrEmpty(trade.psychology?.disciplineScore),
  stressLevel: valueOrEmpty(trade.psychology?.stressLevel),
  mistakesList: trade.mistakes?.mistakesList?.join(', ') || '',
  ruleBroken: Boolean(trade.mistakes?.ruleBroken),
  followedPlan: trade.mistakes?.followedPlan ?? true,
  revengeTrade: Boolean(trade.mistakes?.revengeTrade),
  whatWentWell: valueOrEmpty(trade.review?.whatWentWell),
  whatWentWrong: valueOrEmpty(trade.review?.whatWentWrong),
  lessonLearned: valueOrEmpty(trade.review?.lessonLearned),
  improvement: valueOrEmpty(trade.review?.improvement),
  tradeGrade: trade.review?.tradeGrade || initialForm.tradeGrade,
  beforeScreenshot: valueOrEmpty(trade.media?.beforeScreenshot),
  afterScreenshot: valueOrEmpty(trade.media?.afterScreenshot),
  notes: valueOrEmpty(trade.media?.notes),
})

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`h-11 w-full rounded-md border border-white/10 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50 ${className}`}
    />
  )
}

function PercentInput(props) {
  return (
    <div className="flex h-11 w-full items-center rounded-md border border-white/10 bg-black/20 focus-within:border-cyan-400/50">
      <input
        {...props}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-600"
      />
      <span className="border-l border-white/10 px-3 text-sm text-slate-500">%</span>
    </div>
  )
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="h-11 w-full rounded-md border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-cyan-400/50"
    >
      {children}
    </select>
  )
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="min-h-28 w-full rounded-md border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
    />
  )
}

function Section({ title, description, children }) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#0d121a] p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  )
}

function AddTrade({ mode = 'create' }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = mode === 'edit'
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isEditMode) return

    const fetchTrade = async () => {
      try {
        const { data } = await api.get(`/trades/${id}`)
        setForm(tradeToForm(data))
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this trade for editing.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrade()
  }, [id, isEditMode])

  const updateField = (event) => {
    const { checked, name, type, value } = event.target
    const nextValue = name === 'symbol' ? value.toUpperCase() : value
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : nextValue,
    }))
  }

  const buildPayload = () => ({
    basicInfo: {
      symbol: form.symbol.toUpperCase(),
      market: form.market,
      direction: form.direction,
      tradeDate: form.tradeDate || undefined,
      session: form.session,
      timeframe: form.timeframe,
      strategy: form.strategy,
    },
    setup: {
      setupName: form.setupName,
      setupGrade: form.setupGrade,
      marketCondition: form.marketCondition,
      higherTimeframeBias: form.higherTimeframeBias,
      confluences: form.confluences
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      entryReason: form.entryReason,
    },
    execution: {
      entryPrice: Number(form.entryPrice),
      exitPrice: numberOrUndefined(form.exitPrice),
      stopLoss: numberOrUndefined(form.stopLoss),
      takeProfit: numberOrUndefined(form.takeProfit),
      quantity: Number(form.quantity),
      leverage: numberOrUndefined(form.leverage),
      fees: numberOrUndefined(form.fees),
      adversePriceMove: numberOrUndefined(form.adversePriceMove),
    },
    risk: {
      accountBalanceBefore: numberOrUndefined(form.accountBalanceBefore),
      riskAmount: numberOrUndefined(form.riskAmount),
      riskPercent: numberOrUndefined(form.riskPercent),
      plannedRR: numberOrUndefined(form.plannedRR),
      actualRR: numberOrUndefined(form.actualRR),
      rMultiple: numberOrUndefined(form.rMultiple),
    },
    result: {
      pnl: numberOrUndefined(form.pnl),
      pnlPercent: numberOrUndefined(form.pnlPercent),
      result: form.result,
      holdingTime: form.holdingTime,
    },
    psychology: {
      emotionBefore: form.emotionBefore,
      emotionDuring: form.emotionDuring,
      emotionAfter: form.emotionAfter,
      confidenceLevel: Number(form.confidenceLevel),
      disciplineScore: Number(form.disciplineScore),
      stressLevel: Number(form.stressLevel),
    },
    mistakes: {
      mistakesList: form.mistakesList
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      ruleBroken: form.ruleBroken,
      followedPlan: form.followedPlan,
      revengeTrade: form.revengeTrade,
    },
    review: {
      whatWentWell: form.whatWentWell,
      whatWentWrong: form.whatWentWrong,
      lessonLearned: form.lessonLearned,
      improvement: form.improvement,
      tradeGrade: form.tradeGrade,
    },
    media: {
      beforeScreenshot: form.beforeScreenshot,
      afterScreenshot: form.afterScreenshot,
      notes: form.notes,
    },
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const { data } = isEditMode
        ? await api.put(`/trades/${id}`, buildPayload())
        : await api.post('/trades', buildPayload())
      navigate(isEditMode ? `/trades/${data._id || id}` : '/trades')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this trade.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#0d121a] p-6">
        Loading trade editor...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-4 text-red-200">
          {error}
        </div>
      ) : null}

      <Section title="Basic Info" description="Define the market context before judging outcome.">
        <Field label="Symbol">
          <Input
            name="symbol"
            value={form.symbol}
            onChange={updateField}
            required
            placeholder="BTCUSDT"
            className="uppercase"
          />
        </Field>
        <Field label="Market">
          <Select name="market" value={form.market} onChange={updateField}>
            {['Crypto', 'Forex', 'Stock', 'Index', 'Commodity'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
        <Field label="Direction">
          <Select name="direction" value={form.direction} onChange={updateField}>
            <option>LONG</option>
            <option>SHORT</option>
          </Select>
        </Field>
        <Field label="Trade Date">
          <Input
            type="date"
            name="tradeDate"
            value={form.tradeDate}
            onChange={updateField}
            onClick={openDatePicker}
          />
        </Field>
        <Field label="Session">
          <Select name="session" value={form.session} onChange={updateField}>
            {['Asia', 'London', 'New York', 'Overlap', 'Other'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
        <Field label="Timeframe">
          <Input name="timeframe" value={form.timeframe} onChange={updateField} placeholder="15m / 1h / 4h" />
        </Field>
      </Section>

      <Section title="Setup" description="Capture the thesis, confluences, and playbook quality.">
        <Field label="Strategy">
          <Input name="strategy" value={form.strategy} onChange={updateField} placeholder="ICT / SMC / Breakout" />
        </Field>
        <Field label="Setup Name">
          <Input name="setupName" value={form.setupName} onChange={updateField} placeholder="Liquidity sweep" />
        </Field>
        <Field label="Setup Grade">
          <Select name="setupGrade" value={form.setupGrade} onChange={updateField}>
            {['A+', 'A', 'B', 'C', 'D'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
        <Field label="Market Condition">
          <Select name="marketCondition" value={form.marketCondition} onChange={updateField}>
            {['Trending', 'Range', 'Breakout', 'Reversal', 'Choppy'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
        <Field label="Higher Timeframe Bias">
          <Select name="higherTimeframeBias" value={form.higherTimeframeBias} onChange={updateField}>
            {['Bullish', 'Bearish', 'Neutral'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
        <Field label="Confluences">
          <Input name="confluences" value={form.confluences} onChange={updateField} placeholder="HTF trend, VWAP, liquidity" />
        </Field>
        <div className="md:col-span-2 xl:col-span-3">
          <Field label="Entry Reason">
            <Textarea name="entryReason" value={form.entryReason} onChange={updateField} placeholder="Why this trade deserved risk" />
          </Field>
        </div>
      </Section>

      <Section title="Execution & Risk" description="Separate planned risk from execution result.">
        {[
          ['Entry Price', 'entryPrice', true],
          ['Exit Price', 'exitPrice'],
          ['Stop Loss', 'stopLoss'],
          ['Take Profit', 'takeProfit'],
          ['Quantity', 'quantity', true],
          ['Leverage', 'leverage'],
          ['Fees', 'fees'],
          ['Against Entry', 'adversePriceMove', false, 'percent'],
          ['Account Balance Before', 'accountBalanceBefore'],
          ['Risk Amount', 'riskAmount'],
          ['Risk Percent', 'riskPercent'],
          ['Planned RR', 'plannedRR'],
          ['Actual RR', 'actualRR'],
          ['R Multiple', 'rMultiple'],
          ['P&L', 'pnl'],
          ['P&L Percent', 'pnlPercent'],
        ].map(([label, name, required, variant]) => (
          <Field key={name} label={label}>
            {variant === 'percent' ? (
              <PercentInput
                type="number"
                step="any"
                name={name}
                value={form[name]}
                onChange={updateField}
                required={required}
              />
            ) : (
              <Input
                type="number"
                step="any"
                name={name}
                value={form[name]}
                onChange={updateField}
                required={required}
              />
            )}
          </Field>
        ))}
        <Field label="Result">
          <Select name="result" value={form.result} onChange={updateField}>
            {['Win', 'Loss', 'Break Even', 'Open'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
        <Field label="Holding Time">
          <Input name="holdingTime" value={form.holdingTime} onChange={updateField} placeholder="2h 15m" />
        </Field>
      </Section>

      <Section title="Psychology" description="Score the mental state that produced the decision.">
        <Field label="Emotion Before">
          <Input name="emotionBefore" value={form.emotionBefore} onChange={updateField} placeholder="Calm, patient" />
        </Field>
        <Field label="Emotion During">
          <Input name="emotionDuring" value={form.emotionDuring} onChange={updateField} placeholder="Focused" />
        </Field>
        <Field label="Emotion After">
          <Input name="emotionAfter" value={form.emotionAfter} onChange={updateField} placeholder="Neutral" />
        </Field>
        <Field label="Confidence Level">
          <Input type="number" min="1" max="10" name="confidenceLevel" value={form.confidenceLevel} onChange={updateField} />
        </Field>
        <Field label="Discipline Score">
          <Input type="number" min="1" max="10" name="disciplineScore" value={form.disciplineScore} onChange={updateField} />
        </Field>
        <Field label="Stress Level">
          <Input type="number" min="1" max="10" name="stressLevel" value={form.stressLevel} onChange={updateField} />
        </Field>
      </Section>

      <Section title="Mistakes & Review" description="Turn each trade into a process improvement note.">
        <Field label="Mistakes">
          <Input name="mistakesList" value={form.mistakesList} onChange={updateField} placeholder="FOMO, moved stop" />
        </Field>
        <Field label="Trade Grade">
          <Select name="tradeGrade" value={form.tradeGrade} onChange={updateField}>
            {['A+', 'A', 'B', 'C', 'D'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
        <div className="flex items-center gap-6 pt-7">
          {[
            ['Rule Broken', 'ruleBroken'],
            ['Followed Plan', 'followedPlan'],
            ['Revenge Trade', 'revengeTrade'],
          ].map(([label, name]) => (
            <label key={name} className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" name={name} checked={form[name]} onChange={updateField} />
              {label}
            </label>
          ))}
        </div>
        {[
          ['What Went Well', 'whatWentWell'],
          ['What Went Wrong', 'whatWentWrong'],
          ['Lesson Learned', 'lessonLearned'],
          ['Improvement', 'improvement'],
          ['Notes', 'notes'],
        ].map(([label, name]) => (
          <div key={name} className="md:col-span-2 xl:col-span-3">
            <Field label={label}>
              <Textarea name={name} value={form[name]} onChange={updateField} />
            </Field>
          </div>
        ))}
        <Field label="Before Screenshot URL">
          <Input name="beforeScreenshot" value={form.beforeScreenshot} onChange={updateField} />
        </Field>
        <Field label="After Screenshot URL">
          <Input name="afterScreenshot" value={form.afterScreenshot} onChange={updateField} />
        </Field>
      </Section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Trade' : 'Save Trade'}
        </button>
      </div>
    </form>
  )
}

export default AddTrade
