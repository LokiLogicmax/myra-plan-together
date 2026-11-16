import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Logo, MyraOrb, MyraMark } from '../art.jsx'
import { HOST, FRIENDS, EXPERIENCES, PARTY } from '../data.js'
import { Compass, MapTrifold, Train, Bed, ShareNetwork, UsersThree, CreditCard, PaperPlaneTilt, Check } from '@phosphor-icons/react'
import { PHOTOS } from '../photos.js'

export function Header({ ctx }) {
  const { s, go } = ctx
  return (
    <header className={'hdr hdr-' + s.view}>
      <div className="hdr-in">
        <button className="hdr-menu" aria-label="Menu"><span /><span /><span /></button>
        <button className="logo-btn" onClick={() => go('home')} aria-label="Home"><Logo /></button>
        <span className="concept-pill" title="Concept prototype, not affiliated with MakeMyTrip">Concept</span>
        <nav className="hdr-links">
          <a><b>List Your Property</b><small>Grow your business!</small></a>
          <a><b>Introducing myBiz</b><small>Business Travel Solution</small></a>
          <a><b>My Trips</b><small>Manage your bookings</small></a>
          <a><b>Wishlist</b><small>Save favourites</small></a>
        </nav>
        <span className="hdr-mycash"><i>my</i>Cash</span>
        {s.view === 'friend'
          ? <span className="hdr-user"><Avatar who="meera" /> <span className="hide-sm">Meera</span></span>
          : s.view === 'home'
            ? <button className="hdr-login"><span className="login-dot">my</span> <span className="hide-sm">Login or Create Account</span><span className="show-sm">Login</span></button>
            : <span className="hdr-user"><Avatar who="host" /> <span className="hide-sm">Hi, Aarav</span></span>}
      </div>
    </header>
  )
}

export function ConceptNote({ ctx, restart }) {
  const { go, s } = ctx
  const [credits, setCredits] = useState(false)
  const ready = s.city && s.shortTransport.length && s.shortStay.length
  return (
    <footer className="concept">
      <p>
        Concept prototype made for a design assignment. It is not affiliated with, endorsed by or connected to MakeMyTrip.
        All prices, seats, reviews and people are sample data. Nothing is booked and no payment is taken.
      </p>
      <p>
        Logo: MakeMyTrip, from Wikimedia Commons. Product icons: MakeMyTrip, from a screenshot. Nav icons: Phosphor Icons (MIT). Photos: Wikimedia Commons contributors, used under their licences; stays and prices are made up.{' '}
        <button onClick={() => setCredits((c) => !c)}>{credits ? 'Hide photo credits' : 'Photo credits'}</button>
      </p>
      {credits && (
        <ul className="credits">
          {Object.values(PHOTOS).map((p) => (
            <li key={p.src}><a href={p.page} target="_blank" rel="noreferrer">{p.title}</a> · {p.author} · {p.license}</li>
          ))}
        </ul>
      )}
      <p className="jump">
        Demo: <button onClick={restart}>Restart</button>
        {ready && ctx.group && s.shared ? <>· <button onClick={() => go('friend')}>Friend's view</button> · <button onClick={() => go('review')}>Results</button></> : null}
      </p>
    </footer>
  )
}

const PEOPLE = { host: HOST, ...Object.fromEntries(FRIENDS.map((f) => [f.id, f])) }

export function Avatar({ who, size = 28, ring }) {
  const p = PEOPLE[who]
  if (!p) return null
  return (
    <span className={'av' + (ring ? ' ring' : '')} style={{ background: p.color, width: size, height: size, fontSize: size * 0.42 }} title={p.name}>
      {p.name[0]}
    </span>
  )
}

export function Avatars({ ids, size = 26 }) {
  return <span className="avs">{ids.map((id) => <Avatar key={id} who={id} size={size} ring />)}</span>
}

export const nameOf = (id) => PEOPLE[id]?.name || id

/* ---------------- Planner layout (from the wireframes) ----------------
   Desktop: decided band on top, stage in the middle, action bar at the bottom,
   step tracker and Myra on the right.
   Phone: capsule at the top, thin progress, stage, sticky action, Myra in a drawer. */

export function Planner({ ctx, steps, current, chips, capsule, title, sub, back, children, actions, myra, banner }) {
  const [drawer, setDrawer] = useState(false)
  const [capOpen, setCapOpen] = useState(false)
  return (
    <div className="planner">
      <button className={'capsule' + (capOpen ? ' open' : '') + (ctx.s.loading ? ' busy' : '')} onClick={() => setCapOpen((o) => !o)} aria-expanded={capOpen}>
        <MyraOrb size={22} pulse={!!ctx.s.loading} />
        <span className="cap-text">{capsule}</span>
        <span className="cap-caret">{capOpen ? '▴' : '▾'}</span>
        {capOpen && <span className="cap-chips">{chips}</span>}
      </button>
      <div className="progress" aria-hidden="true" style={{ '--n': steps.length }}>
        {steps.map((st, i) => <span key={st} className={i < current ? 'done' : i === current ? 'now' : ''} />)}
        <em>{steps[current]} · step {current + 1} of {steps.length}</em>
      </div>

      <div className="pl-main">
        <section className="decided" aria-label="What's decided">
          <div className="chip-row">{chips}</div>
        </section>
        {banner}
        <section className="stage card">
          {back && <button className="back" onClick={back.onClick}>‹ {back.label}</button>}
          <h1 className="stage-title">{title}</h1>
          {sub && <p className="stage-sub">{sub}</p>}
          <div className="stage-body">{children}</div>
        </section>
        <div className="action-bar">
          <ChatBox ctx={ctx} className="hide-sm" />
          <button className="ask-myra show-sm" onClick={() => setDrawer(true)}><MyraOrb size={20} /> Ask Myra</button>
          <div className="actions">{actions}</div>
        </div>
      </div>

      <aside className="pl-rail">
        <Tracker ctx={ctx} steps={steps} current={current} />
        <MyraCard ctx={ctx} myra={myra} />
      </aside>

      {drawer && createPortal(
        <div className="drawer-wrap" onClick={() => setDrawer(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Myra">
            <span className="grab" />
            <MyraCard ctx={ctx} myra={myra} />
            <ChatBox ctx={ctx} />
          </div>
        </div>,
        document.getElementById('overlay-root') || document.body,
      )}
    </div>
  )
}

const STEP_ICON = {
  'Trip basics': Compass, City: MapTrifold, Transport: Train, Stay: Bed,
  'Share with friends': ShareNetwork, 'Friends vote': UsersThree, 'Review & book': CreditCard, 'Send your picks': PaperPlaneTilt,
}

// One line on what's decided (or what's next) for each step.
function stepDetail(st, ctx) {
  const { s, group } = ctx
  const friend = s.view === 'friend'
  const count = (list, picked) => (!list.length ? null : group ? list.length + ' in the vote' : picked)
  const exp = EXPERIENCES.find((e) => e.id === s.basics.exp)
  const tPicked = ctx.allTransport?.find((t) => t.id === s.shortTransport[0])?.title.split(' · ')[0]
  const sPicked = ctx.stays?.find((x) => x.id === s.shortStay[0])?.name
  if (friend) {
    if (st === 'Transport') return s.friend.votes.transport ? 'You’ve picked' : 'Pick one of ' + s.shortTransport.length
    if (st === 'Stay') return s.friend.votes.stay ? 'You’ve picked' : 'Pick one of ' + s.shortStay.length
    if (st === 'Send your picks') return s.friend.sent ? 'Sent to Aarav' : 'One tap'
  }
  return {
    'Trip basics': exp ? exp.label + ' · ' + (PARTY[s.basics.people]?.label || '') : 'Kind of trip, who, when',
    City: ctx.city ? ctx.city.name + ' · ' + ctx.city.tag : 'Pick from 3',
    Transport: count(s.shortTransport, tPicked) || (group ? 'Shortlist up to 3' : 'Choose one'),
    Stay: count(s.shortStay, sPicked) || (group ? 'Shortlist up to 3' : 'Choose one'),
    'Share with friends': s.shared ? 'Link shared' : 'One link, no login',
    'Friends vote': 'Closes Wed 25 Nov, 9 pm',
    'Review & book': group ? 'Pay once everyone agrees' : 'Check and pay',
  }[st] || ''
}

export function Tracker({ ctx, steps, current }) {
  return (
    <div className="tracker">
      <span className="rail-label">Steps</span>
      <ol>
        {steps.map((st, i) => {
          const Ico = STEP_ICON[st] || Compass
          const state = i < current ? 'done' : i === current ? 'now' : 'next'
          return (
            <li key={st} className={'tcard ' + state} aria-current={state === 'now' ? 'step' : undefined}>
              <span className="tc-ico"><Ico size={20} weight={state === 'next' ? 'regular' : 'fill'} /></span>
              <span className="tc-text"><b>{st}</b><small>{stepDetail(st, ctx)}</small></span>
              <span className="tc-meta">{state === 'done' ? <><Check size={13} weight="bold" /> Done</> : state === 'now' ? 'Now' : 'Step ' + (i + 1)}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function MyraCard({ ctx, myra }) {
  const { s, say } = ctx
  if (!myra) return null
  return (
    <div className="myra-card">
      <div className="myra-head"><MyraOrb size={30} /> <MyraMark size={22} /></div>
      <p className="myra-msg">{myra.intro}</p>
      {s.thread.map((m, i) => (
        <p key={i} className={'bubble ' + m.who}>{m.text}</p>
      ))}
      {myra.replies?.length > 0 && (
        <div className="quick">
          {myra.replies.map((r) => (
            <button key={r.label} onClick={() => (r.onClick ? r.onClick() : say(r.label, r.answer))}>{r.label}</button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ChatBox({ ctx, className = '' }) {
  return (
    <VoiceInput
      className={'chatbox ' + className}
      placeholder="Ask Myra anything, or just tap the options"
      sample="is there anything cheaper?"
      onSubmit={(t) => ctx.say(t, answer(t, ctx))}
    />
  )
}

// One input for typing or speaking. The round button records voice; it becomes "send" once you type.
export function VoiceInput({ className = '', placeholder, sample, onSubmit, lead }) {
  const [text, setText] = useState('')
  const [rec, setRec] = useState(false)
  const [secs, setSecs] = useState(0)
  const timers = useRef([])
  const heard = useRef('')
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => clear, [])

  const start = () => {
    clear(); setText(''); heard.current = ''; setRec(true); setSecs(0)
    const words = sample.split(' ')
    // Words arrive as you speak, with a pause in the middle (people think while they talk).
    let t = 700
    words.forEach((w, i) => {
      t += i === Math.floor(words.length / 2) ? 900 : 260
      timers.current.push(setTimeout(() => { heard.current = (heard.current ? heard.current + ' ' : '') + w; setText(heard.current) }, t))
    })
    for (let k = 1; k <= Math.ceil((t + 1200) / 1000); k++) timers.current.push(setTimeout(() => setSecs(k), k * 1000))
    timers.current.push(setTimeout(() => stop(), t + 1200))
  }
  // Stopping sends what was heard, like a voice note.
  const stop = () => {
    clear(); setRec(false)
    const t = heard.current.trim()
    heard.current = ''
    setText('')
    if (t) onSubmit(t)
  }
  const submit = (e) => {
    e.preventDefault()
    const t = text.trim()
    if (!t || rec) return
    onSubmit(t)
    setText('')
  }
  const typed = text.trim().length > 0 && !rec
  return (
    <form className={'vinput ' + className + (rec ? ' rec' : '')} onSubmit={submit}>
      {lead !== false && <MyraOrb size={28} state={rec ? 'listen' : 'idle'} />}
      {rec && <span className="wave" aria-hidden="true">{Array.from({ length: 5 }).map((_, i) => <i key={i} style={{ '--d': i * 0.12 + 's' }} />)}</span>}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        readOnly={rec}
        placeholder={rec ? 'Listening… take your time' : placeholder}
        aria-label={placeholder}
      />
      {rec && <span className="rec-time">0:{String(secs).padStart(2, '0')}</span>}
      {typed ? (
        <button type="submit" className="vbtn send" aria-label="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      ) : (
        <button type="button" className={'vbtn voice' + (rec ? ' on' : '')} onClick={() => (rec ? stop() : start())} aria-label={rec ? 'Stop recording' : 'Record a voice message'} aria-pressed={rec}>
          {rec
            ? <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="3" fill="currentColor" /></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3" fill="currentColor" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}
        </button>
      )}
    </form>
  )
}

// Scripted replies. In the prototype Myra answers from fixed text.
export function answer(t, ctx) {
  const q = t.toLowerCase()
  if (/cheap|budget|less|save|kam/.test(q)) return 'The overnight train is the cheapest way there (₹2,360 return each). For stays, Fig Tree Homestay is the cheapest whole house: about ₹3,200 each for 2 nights with 6 people.'
  if (/pool|swim/.test(q)) return 'Casa Azul Villa has a private pool. Sunset Bay Resort has a shared one.'
  if (/beach|close|walk/.test(q)) return 'Lazy Gecko is 400 m from Anjuna Beach, and Sunset Bay is right on Vagator Beach. The villa and the homestay are in Assagao, a 10-minute scooter ride away.'
  if (/mopa|airport|dabolim/.test(q)) return 'Goa has two airports. Dabolim (GOI) is central. Mopa (GOX) is in the north: fine for Anjuna, but 2 hours from South Goa.'
  if (/vote|friend|who/.test(q)) return 'Friends get one link. They can’t change the city, but they vote on transport and stay and can comment. You make the final call.'
  if (/book|pay/.test(q)) return 'Nothing is booked until you approve. You’ll see exactly what I’ll book and the total before you pay.'
  if (ctx.s.view === 'start') return 'Got it. Pick the vibe and the basics on the cards, and I’ll take it from there.'
  return 'Noted. I’ll keep that in mind for the next step. (In this prototype my replies are scripted.)'
}
