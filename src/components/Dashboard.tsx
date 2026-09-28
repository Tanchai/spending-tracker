import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  CATEGORIES, catEmoji, catLabel,
  type Category, type Spending,
} from '../lib/types'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const WHOS = ['you', 'bae']

export function Dashboard() {
  const [rows, setRows] = useState<Spending[] | null>(null)
  const [busy, setBusy] = useState(false)

  // form state
  const [who, setWho] = useState('you')
  const [cat, setCat] = useState<Category>('groceries')
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const [shared, setShared] = useState(true)
  const [date, setDate] = useState(today())

  function today() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }

  async function load() {
    const { data, error } = await supabase
      .from('spending')
      .select('*')
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(500)
    if (!error) setRows(data as Spending[])
  }

  useEffect(() => { load() }, [])

  async function add() {
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) return
    setBusy(true)
    const { error } = await supabase.from('spending').insert({
      added_name: who,
      entry_date: date,
      amount: amt,
      category: cat,
      description: desc,
      shared,
    })
    setBusy(false)
    if (!error) {
      setAmount(''); setDesc('')
      load()
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this entry?')) return
    await supabase.from('spending').delete().eq('id', id)
    load()
  }

  // ---------- computed totals ----------
  const total = rows?.reduce((s, r) => s + r.amount, 0) ?? 0
  const sharedTotal = rows?.filter(r => r.shared).reduce((s, r) => s + r.amount, 0) ?? 0
  const myShare = sharedTotal / 2

  const byCat: { key: Category; amount: number }[] =
    CATEGORIES.map(c => {
      const amt = rows?.filter(r => r.category === c.key).reduce((s, r) => s + r.amount, 0) ?? 0
      return { key: c.key, amount: amt }
    }).filter(x => x.amount > 0).sort((a, b) => b.amount - a.amount)

  const currentMonth = rows?.filter(r => {
    const d = new Date(r.entry_date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).reduce((s, r) => s + r.amount, 0) ?? 0

  const monthLabel = `${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`

  return (
    <div className="page">
      <header>
        <h1>our money ♡</h1>
        <p className="sub">{monthLabel} spending: <strong>${fmt(currentMonth)}</strong></p>
      </header>

      <div className="cards">
        <div className="card"><span className="num">{fmt(total)}</span><span className="lbl">all-time</span></div>
        <div className="card"><span className="num">{fmt(currentMonth)}</span><span className="lbl">this month</span></div>
        <div className="card"><span className="num">{fmt(myShare)}</span><span className="lbl">your half of shared 💛</span></div>
      </div>

      <div className="add">
        <h3>＋ add an expense</h3>
        <div className="cats">
          <span className="wholabel">who: </span>
          {WHOS.map(w => (
            <button key={w} className={`chip ${who === w ? 'on' : ''}`}
              onClick={() => setWho(w)}>{w === 'you' ? '🙋 you' : '😼 bae'}</button>
          ))}
        </div>
        <div className="cats" style={{ marginTop: '.5rem' }}>
          {CATEGORIES.map(c => (
            <button key={c.key} className={`chip ${cat === c.key ? 'on' : ''}`}
              onClick={() => setCat(c.key)}>{c.emoji} {c.label}</button>
          ))}
        </div>
        <div className="row">
          <input type="number" step="0.01" min="0" placeholder="0.00" value={amount}
            onChange={e => setAmount(e.target.value)} />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <input type="text" placeholder="what was it? (e.g. weekly shop)" value={desc}
          onChange={e => setDesc(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') add() }} />
        <label className="tog">
          <input type="checkbox" checked={shared} onChange={e => setShared(e.target.checked)} />
          split 50/50 with bae
        </label>
        <button onClick={add} disabled={busy || !amount}>{busy ? '…' : 'Add'}</button>
      </div>

      <div className="stripes">
        <h3>by category</h3>
        {byCat.length === 0 && <p className="empty">no spending yet — add something above ☝️</p>}
        {byCat.map(({ key, amount }) => {
          const pct = total > 0 ? Math.round((amount / total) * 100) : 0
          return (
            <div key={key} className="stripe">
              <span className="c">{catEmoji(key)} {catLabel(key)}</span>
              <span className="bar"><i style={{ width: `${pct}%` }} /></span>
              <span className="a">{fmt(amount)}</span>
            </div>
          )
        })}
      </div>

      <div className="list">
        <h3>recent</h3>
        {rows?.map(r => {
          const d = new Date(r.entry_date)
          return (
            <div key={r.id} className="entry">
              <span className="e">{catEmoji(r.category)}</span>
              <div className="mid">
                <div className="t">{r.description || catLabel(r.category)}
                  {r.shared && <span className="badge split">split</span>}
                </div>
                <div className="m">
                  {MONTHS[d.getMonth()]} {d.getDate()} · {r.added_name || 'someone'}
                </div>
              </div>
              <span className="amt">${fmt(r.amount)}</span>
              <button className="x" onClick={() => remove(r.id)}>✕</button>
            </div>
          )
        })}
        {rows && rows.length === 0 && <p className="empty">nothing here yet ♡</p>}
      </div>
    </div>
  )
}

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })