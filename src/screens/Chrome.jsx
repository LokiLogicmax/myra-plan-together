import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Logo, MyraOrb } from '../art.jsx'
import { HOST, FRIENDS } from '../data.js'

export function Header({ ctx }) {
  const { s, go } = ctx
  return (
    <header className={'hdr hdr-' + s.view}>
      <div className="hdr-in">
        <button className="hdr-menu" aria-label="Menu"><span /><span /><span /></button>
        <button className="logo-btn" onClick={() => go('home')} aria-label="Home"><Logo /></button>
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
  const ready = s.city && s.shortTransport.length && s.shortStay.length
  return (
    <footer className="concept">
      <p>
        Concept prototype made for a design assignment. It is not affiliated with, endorsed by or connected to MakeMyTrip.
        All prices, seats, reviews and people are sample data. Nothing is booked and no payment is taken.
      </p>
      <p className="jump">
        Demo: <button onClick={restart}>Restart</button>
        {ready ? <>· <button onClick={() => go('friend')}>Friend's view</button> · <button onClick={() => go('review')}>Results</button></> : null}
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
          <span className="decided-label">Your trip</span>
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
        <Tracker steps={steps} current={current} />
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

export function Tracker({ steps, current }) {
  return (
    <div className="tracker card">
      <span className="rail-label">Steps</span>
      <ol>
        {steps.map((st, i) => (
          <li key={st} className={i < current ? 'done' : i === current ? 'now' : ''}>
            <span className="dot">{i < current ? '✓' : i + 1}</span>
            <span>{st}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function MyraCard({ ctx, myra }) {
  const { s, say } = ctx
  if (!myra) return null
  return (
    <div className="myra-card">
      <div className="myra-head"><MyraOrb size={28} /> <span className="myra-word">myra</span></div>
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
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    ctx.say(t, answer(t, ctx))
    setText('')
  }
  const mic = () => {
    setListening(true)
    setTimeout(() => {
      setListening(false)
      setText('is there anything cheaper?')
    }, 1600)
  }
  return (
    <form className={'chatbox ' + className} onSubmit={submit}>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder={listening ? 'Listening… take your time' : 'Ask Myra anything, or just tap the options'} aria-label="Message Myra" />
      <button type="button" className={'mic' + (listening ? ' on' : '')} onClick={mic} aria-label="Speak instead (optional)">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3" fill="currentColor" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
      </button>
      <button type="submit" className="send" aria-label="Send">↑</button>
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
