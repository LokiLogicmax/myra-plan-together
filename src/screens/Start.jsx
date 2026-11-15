import { useState } from 'react'
import { EXPERIENCES, PEOPLE, FROM, WHEN } from '../data.js'
import { Scene, MyraMark, MyraOrb } from '../art.jsx'
import { VoiceInput } from './Chrome.jsx'

export function Start({ ctx }) {
  const { s, set, go } = ctx
  const b = s.basics
  const setB = (patch) => set({ basics: { ...b, ...patch } })
  const [heard, setHeard] = useState(null)

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

      <div className="basics card">
        <Group label="Who’s coming" hint="A range is fine. Plans change.">
          {PEOPLE.map((p) => <Chip key={p} on={b.people === p} onClick={() => setB({ people: p })}>{p} people</Chip>)}
        </Group>
        <Group label="Starting from">
          {FROM.map((c) => <Chip key={c} on={b.from === c} onClick={() => setB({ from: c })}>{c}</Chip>)}
        </Group>
        <Group label="When">
          {WHEN.map((w) => <Chip key={w.id} on={b.when === w.id} onClick={() => setB({ when: w.id })}>{w.label}<small>{w.sub}</small></Chip>)}
        </Group>
      </div>

      <div className="start-cta">
        <button className="cta big" disabled={!b.exp} onClick={begin}>Plan with Myra</button>
        {!b.exp && <p className="hint">Pick a kind of trip to start</p>}
      </div>
    </div>
  )
}

function Group({ label, hint, children }) {
  return (
    <div className="group">
      <span className="g-label">{label}{hint && <small> · {hint}</small>}</span>
      <div className="g-chips">{children}</div>
    </div>
  )
}

export function Chip({ on, onClick, children, disabled }) {
  return <button className={'chip' + (on ? ' on' : '')} aria-pressed={!!on} onClick={onClick} disabled={disabled}>{children}</button>
}
