import { useEffect, useState } from 'react'
import { UsersThree, MapPin, CalendarBlank, CaretDown, Check } from '@phosphor-icons/react'
import { EXPERIENCES, PEOPLE, FROM, WHEN } from '../data.js'
import { Scene, MyraMark, MyraOrb } from '../art.jsx'
import { VoiceInput } from './Chrome.jsx'

export function Start({ ctx }) {
  const { s, set, go } = ctx
  const b = s.basics
  const setB = (patch) => set({ basics: { ...b, ...patch } })
  const [heard, setHeard] = useState(null)
  const [open, setOpen] = useState(null)
  const toggle = (k) => setOpen((o) => (o === k ? null : k))
  const pick = (patch) => { setB(patch); setOpen(null) }
  const w = WHEN_BIG[b.when] || WHEN_BIG.w2
  useEffect(() => {
    if (!open) return
    const close = (e) => { if (!e.target.closest('.bf')) setOpen(null) }
    const esc = (e) => { if (e.key === 'Escape') setOpen(null) }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc) }
  }, [open])

  // Typing is optional: a simple parser fills the same choices.
  const parse = (raw) => {
    const t = raw.toLowerCase()
    const patch = {}
    const n = parseInt((t.match(/\b(\d{1,2})\b/) || [])[1] || ({ three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8 }[(t.match(/\b(three|four|five|six|seven|eight)\b/) || [])[1]]) || 0, 10)
    if (n) patch.people = n <= 4 ? '3–4' : n <= 6 ? '5–6' : n <= 8 ? '7–8' : '9+'
    if (/beach|sea|chill|goa/.test(t)) patch.exp = 'beach'
    else if (/mountain|hill|trek|snow/.test(t)) patch.exp = 'hills'
    else if (/party|club|night/.test(t)) patch.exp = 'party'
    else if (/heritage|food|history|old/.test(t)) patch.exp = 'heritage'
    else if (/quiet|calm|peace|nature/.test(t)) patch.exp = 'quiet'
    const from = FROM.find((c) => t.includes(c.toLowerCase()) || (c === 'Bengaluru' && t.includes('bangalore')))
    if (from) patch.from = from
    if (/this weekend/.test(t)) patch.when = 'w1'
    else if (/next weekend|next week/.test(t)) patch.when = 'w2'
    setB(patch)
    const bits = []
    if (patch.exp) bits.push(EXPERIENCES.find((e) => e.id === patch.exp).label)
    if (patch.people) bits.push(patch.people + ' people')
    if (patch.from) bits.push('from ' + patch.from)
    if (patch.when) bits.push(WHEN.find((w) => w.id === patch.when).sub)
    setHeard(bits.length ? 'Got it: ' + bits.join(' · ') + '. I’ve ticked these below. Change anything you like.' : 'I didn’t catch the details. Tap the cards below instead.')
  }

  const begin = () => {
    go('plan', { stage: 'city', loading: 'city' })
  }

  return (
    <div className="start">
      <button className="start-close" onClick={() => go('home')} aria-label="Close">✕</button>
      <div className="start-head">
        <h1 className="start-logo"><img src="/brand/mmt-logo.svg" alt="MakeMyTrip" /></h1>
        <p className="with">with <MyraMark size={40} /></p>
        <div className="hero-orb after"><MyraOrb size={64} /></div>
        <p className="start-q">What kind of trip are you in the mood for?</p>
      </div>

      <div className="fan" role="radiogroup" aria-label="Kind of trip">
        {EXPERIENCES.map((e, i) => (
          <button
            key={e.id}
            role="radio"
            aria-checked={b.exp === e.id}
            className={'fan-card' + (b.exp === e.id ? ' on' : '')}
            style={{ '--r': `${(i - 2) * 4}deg`, '--y': `${Math.abs(i - 2) * 8}px` }}
            onClick={() => setB({ exp: e.id })}
          >
            <Scene kind={e.art} label={e.label} />
            <span className="fan-label"><b>{e.label}</b><small>{e.sub}</small></span>
            {b.exp === e.id && <span className="tick">✓</span>}
          </button>
        ))}
      </div>

      <VoiceInput
        className="tell"
        placeholder="Or tell Myra, e.g. “we’re 6, beaches, from Bangalore, next weekend”"
        sample="we are six friends… beaches, from Bangalore, next weekend"
        onSubmit={parse}
      />
      {heard && <p className="heard">{heard}</p>}

      <div className="basics-bar card" role="group" aria-label="Trip basics">
        <Field
          icon={<UsersThree size={16} />} label="Who’s coming" open={open === 'people'} onToggle={() => toggle('people')}
          big={b.people} unit="people" sub="A range is fine"
          options={PEOPLE.map((p) => ({ id: p, title: p + ' people' }))}
          value={b.people} onPick={(v) => pick({ people: v })}
        />
        <Field
          icon={<MapPin size={16} />} label="Starting from" open={open === 'from'} onToggle={() => toggle('from')}
          big={b.from} sub={CODES[b.from]}
          options={FROM.map((c) => ({ id: c, title: c, sub: CODES[c] }))}
          value={b.from} onPick={(v) => pick({ from: v })}
        />
        <Field
          icon={<CalendarBlank size={16} />} label="When" open={open === 'when'} onToggle={() => toggle('when')}
          big={w.big} unit={w.unit} sub={w.day}
          options={WHEN.map((x) => ({ id: x.id, title: x.label, sub: x.sub }))}
          value={b.when} onPick={(v) => pick({ when: v })}
        />
      </div>

      <div className="start-cta">
        <button className="cta big" disabled={!b.exp} onClick={begin}>Plan with Myra</button>
        {!b.exp && <p className="hint">Pick a kind of trip to start</p>}
      </div>
    </div>
  )
}

const CODES = { Bengaluru: 'BLR airport · SBC station', Mumbai: 'BOM airport · CSMT station', Delhi: 'DEL airport · NDLS station', Hyderabad: 'HYD airport · SC station' }
const WHEN_BIG = {
  w1: { big: '20–22', unit: 'Nov’26', day: 'Fri – Sun · This weekend' },
  w2: { big: '27–29', unit: 'Nov’26', day: 'Fri – Sun · Next weekend' },
  w3: { big: 'Pick', unit: 'dates', day: 'Choose on a calendar' },
}

function Field({ icon, label, big, unit, sub, open, onToggle, options, value, onPick }) {
  return (
    <div className={'bf' + (open ? ' open' : '')}>
      <button className="bf-btn" aria-haspopup="listbox" aria-expanded={open} onClick={onToggle}>
        <span className="bf-label">{icon}{label}<CaretDown className="bf-caret" size={13} weight="bold" /></span>
        <span className="bf-big">{big}{unit && <small> {unit}</small>}</span>
        <span className="bf-sub">{sub}</span>
      </button>
      {open && (
        <div className="bf-pop" role="listbox" aria-label={label}>
          {options.map((o) => (
            <button key={o.id} role="option" aria-selected={value === o.id} className={'bf-opt' + (value === o.id ? ' on' : '')} onClick={() => onPick(o.id)}>
              <span><b>{o.title}</b>{o.sub && <small>{o.sub}</small>}</span>
              {value === o.id && <Check size={16} weight="bold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Chip({ on, onClick, children, disabled }) {
  return <button className={'chip' + (on ? ' on' : '')} aria-pressed={!!on} onClick={onClick} disabled={disabled}>{children}</button>
}
