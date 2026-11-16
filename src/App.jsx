import { useEffect, useMemo, useRef, useState } from 'react'
import { CITIES, TRANSPORT, TRANSPORT_ALT, STAYS, FRIENDS, PRESET_VOTES, PRESET_COMMENTS, DEMO_FRIEND, PARTY, STAY_PICK, HOST_STEPS, DUO_STEPS } from './data.js'
import { Home } from './screens/Home.jsx'
import { Start } from './screens/Start.jsx'
import { HostPlan } from './screens/HostPlan.jsx'
import { FriendView } from './screens/FriendView.jsx'
import { Review } from './screens/Review.jsx'
import { Approve, Booked, PaySheet } from './screens/Book.jsx'
import { Header, ConceptNote } from './screens/Chrome.jsx'

const INITIAL = {
  view: 'home',
  basics: { exp: null, people: '5–6', from: 'Bengaluru', when: 'w2', budget: 'b2', gender: 'any' },
  stage: 'city',
  loading: null,
  city: null,
  altShown: false,
  shortTransport: [],
  shortStay: [],
  stayView: 'grid',
  detail: null,
  thread: [],
  friend: { stage: 'transport', votes: { transport: null, stay: null }, comments: { transport: [], stay: [] }, sent: false },
  shared: false, // friends can vote only after the host shares the link
  final: { transport: null, stay: null },
  dropout: null, // null → not yet happened · 'pending' · 'accepted' · 'kept'
  pay: null, // null · 'open' · 'paying'
  toast: null,
}

export default function App() {
  const [s, setS] = useState(INITIAL)
  const [framed, setFramed] = useState(false)
  const scroller = useRef(null)
  const set = (patch) => setS((p) => ({ ...p, ...(typeof patch === 'function' ? patch(p) : patch) }))

  const transportList = useMemo(
    () => TRANSPORT.map((t) => (t.soldOut && s.altShown ? TRANSPORT_ALT : t)),
    [s.altShown],
  )
  const allTransport = [...TRANSPORT, TRANSPORT_ALT]

  // Everyone's votes, worked out from the host's shortlist.
  const votes = useMemo(() => {
    const resolve = (stage, shortlist) => {
      const out = {}
      for (const [who, prefs] of Object.entries(PRESET_VOTES[stage])) {
        const hit = prefs.find((id) => shortlist.includes(id)) || shortlist[0]
        if (hit) out[who] = hit
      }
      const mine = s.friend.sent ? s.friend.votes[stage] : null
      if (mine) out[DEMO_FRIEND] = mine
      if (s.dropout === 'accepted') delete out.riya
      return out
    }
    return { transport: resolve('transport', s.shortTransport), stay: resolve('stay', s.shortStay) }
  }, [s.shortTransport, s.shortStay, s.friend, s.dropout])

  const comments = {
    transport: [...PRESET_COMMENTS.transport, ...s.friend.comments.transport],
    stay: [...PRESET_COMMENTS.stay, ...s.friend.comments.stay],
  }

  const mode = PARTY[s.basics.people]?.mode || 'group'
  const people = mode === 'solo' ? 1 : mode === 'couple' ? 2 : s.dropout === 'accepted' ? 5 : 6
  const going = FRIENDS.filter((f) => !(s.dropout === 'accepted' && f.id === 'riya'))

  const ctx = {
    s, set, framed, transportList, allTransport, votes, comments, people, going, mode,
    group: mode === 'group', steps: mode === 'group' ? HOST_STEPS : DUO_STEPS, stayPick: STAY_PICK[mode],
    city: CITIES.find((c) => c.id === s.city),
    go: (view, extra = {}) => {
      set({ view, detail: null, thread: [], ...extra })
      requestAnimationFrame(() => {
        if (scroller.current && framed) scroller.current.scrollTop = 0
        else window.scrollTo({ top: 0 })
      })
    },
    toast: (msg) => {
      set({ toast: msg })
      clearTimeout(window.__toastT)
      window.__toastT = setTimeout(() => set({ toast: null }), 2600)
    },
    say: (me, reply) => set((p) => ({ thread: [...p.thread, { who: 'me', text: me }, { who: 'myra', text: reply }].slice(-6) })),
    stays: STAYS,
  }

  // Loading states when Myra "checks" something.
  useEffect(() => {
    if (!s.loading) return
    const t = setTimeout(() => set({ loading: null }), 1400)
    return () => clearTimeout(t)
  }, [s.loading])

  // The dropout happens a moment after the host opens the results.
  useEffect(() => {
    if (s.view !== 'review' || s.dropout) return
    const t = setTimeout(() => set({ dropout: 'pending' }), 1800)
    return () => clearTimeout(t)
  }, [s.view, s.dropout])

  const screen = {
    home: <Home ctx={ctx} />,
    start: <Start ctx={ctx} />,
    plan: <HostPlan ctx={ctx} />,
    friend: <FriendView ctx={ctx} />,
    review: <Review ctx={ctx} />,
    approve: <Approve ctx={ctx} />,
    booked: <Booked ctx={ctx} />,
  }[s.view]

  const restart = () => { setS(INITIAL); window.scrollTo({ top: 0 }) }

  return (
    <div className={'stage-wrap' + (framed ? ' framed' : '')}>
      <div className="device">
        <div className="device-scroll" ref={scroller}>
          <Header ctx={ctx} />
          <main className={'view view-' + s.view}>{screen}</main>
          <ConceptNote ctx={ctx} restart={restart} />
        </div>
        <div id="overlay-root" />
        {s.pay && <PaySheet ctx={ctx} />}
        {s.toast && <div className="toast" role="status">{s.toast}</div>}
      </div>
      <button className="view-toggle" onClick={() => setFramed((f) => !f)} aria-pressed={framed}>
        {framed ? 'Website view' : 'App view'}
      </button>
    </div>
  )
}
