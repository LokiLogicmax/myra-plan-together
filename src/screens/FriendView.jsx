import { useState } from 'react'
import { FRIEND_STEPS, DEMO_FRIEND, inr, stayPerPerson } from '../data.js'
import { Scene, ModeIcon } from '../art.jsx'
import { Planner, Avatars, Avatar, nameOf } from './Chrome.jsx'
import { TripChips } from './HostPlan.jsx'

export function FriendView({ ctx }) {
  const { s, set, go, allTransport, stays, votes, comments, people } = ctx
  const f = s.friend
  const setF = (patch) => set({ friend: { ...f, ...patch } })

  if (!s.shortTransport.length || !s.shortStay.length) {
    return <div className="empty card"><h2>Nothing to vote on yet</h2><p>The host hasn’t shortlisted transport and stays yet.</p><button className="cta" onClick={() => go('plan', { stage: 'transport' })}>Back to planning</button></div>
  }

  if (f.sent) {
    return (
      <div className="done-card card">
        <div className="done-ic">✓</div>
        <h1>Your picks are in, Meera</h1>
        <p>Aarav will see everyone’s votes and comments and book once it’s settled. Nothing is charged to you now.</p>
        <div className="done-sum">
          <span>🚆 {allTransport.find((t) => t.id === f.votes.transport)?.title}</span>
          <span>🏡 {stays.find((x) => x.id === f.votes.stay)?.name}</span>
        </div>
        <button className="cta" onClick={() => go('review')}>Switch back to Aarav (host)</button>
      </div>
    )
  }

  const stage = f.stage
  const idx = { transport: 0, stay: 1, send: 2 }[stage]
  const tally = (kind) => {
    const others = Object.entries(votes[kind]).filter(([who]) => who !== DEMO_FRIEND)
    const mine = f.votes[kind]
    const by = {}
    for (const [who, id] of others) (by[id] ||= []).push(who)
    if (mine) (by[mine] ||= []).push(DEMO_FRIEND)
    return by
  }

  const vote = (kind, id) => setF({ votes: { ...f.votes, [kind]: id } })

  let title, sub, body, actions, myra, back
  if (stage === 'transport') {
    const by = tally('transport')
    const opts = allTransport.filter((t) => s.shortTransport.includes(t.id))
    title = 'How should we get there?'
    sub = 'Aarav shortlisted these. Pick one; you can see how others voted.'
    body = (
      <>
        <div className="t-list">
          {opts.map((o) => (
            <VoteRow key={o.id} on={f.votes.transport === o.id} voters={by[o.id] || []} onVote={() => vote('transport', o.id)}>
              <div className="t-ic"><ModeIcon mode={o.mode} /></div>
              <div className="t-main">
                <div className="t-title"><b>{o.title}</b>{o.pick && <span className="pick inline">★ Myra’s pick</span>}</div>
                <div className="t-times"><b>{o.dep}</b><span className="dur">{o.dur}</span><b>{o.arr}</b></div>
                {o.warn && <div className="warn">⚠ {o.warn}</div>}
                <div className="t-back">{inr(o.price)} per person, return</div>
              </div>
            </VoteRow>
          ))}
        </div>
        <Comments ctx={ctx} kind="transport" list={comments.transport} />
      </>
    )
    actions = <button className="cta" disabled={!f.votes.transport} onClick={() => setF({ stage: 'stay' })}>Next: stay</button>
  }
  if (stage === 'stay') {
    const by = tally('stay')
    const opts = stays.filter((x) => s.shortStay.includes(x.id))
    title = 'Where should we stay?'
    sub = 'Prices are per person for 2 nights, if all 6 go.'
    back = { label: 'Transport', onClick: () => setF({ stage: 'transport' }) }
    body = (
      <>
        <div className="vote-grid">
          {opts.map((x) => (
            <VoteRow key={x.id} card on={f.votes.stay === x.id} voters={by[x.id] || []} onVote={() => vote('stay', x.id)}>
              <div className="img"><Scene kind={x.art} label={x.name} />{x.pick && <span className="pick">★ Myra’s pick</span>}</div>
              <div className="sc-body">
                <b>{x.name}</b>
                <span className="area">{x.area} · {x.type}</span>
                <span className="rating-sm"><span className="score">{x.rating}</span> {x.beach}</span>
                <span className="sc-price"><b>{inr(stayPerPerson(x, people))}</b> <small>per person</small></span>
              </div>
            </VoteRow>
          ))}
        </div>
        <Comments ctx={ctx} kind="stay" list={comments.stay} />
      </>
    )
    actions = <button className="cta" disabled={!f.votes.stay} onClick={() => setF({ stage: 'send' })}>Next: check & send</button>
  }
  if (stage === 'send') {
    const t = allTransport.find((x) => x.id === f.votes.transport)
    const st = stays.find((x) => x.id === f.votes.stay)
    title = 'Send your picks'
    sub = 'Aarav makes the final call and books for everyone.'
    back = { label: 'Stay', onClick: () => setF({ stage: 'stay' }) }
    body = (
      <div className="send-sum">
        <div className="sum-row"><span>🚆</span><div><b>{t?.title}</b><small>{t?.dep} → {t?.arr}</small></div><button className="link" onClick={() => setF({ stage: 'transport' })}>Change</button></div>
        <div className="sum-row"><span>🏡</span><div><b>{st?.name}</b><small>{st?.area} · {st?.type}</small></div><button className="link" onClick={() => setF({ stage: 'stay' })}>Change</button></div>
        <div className="sum-row total"><span>₹</span><div><b>About {inr((t?.price || 0) + stayPerPerson(st, people))} for you</b><small>Travel + stay, if all 6 go. You pay Aarav back later.</small></div></div>
      </div>
    )
    actions = <button className="cta" onClick={() => setF({ sent: true })}>Send my picks</button>
  }

  myra = {
    intro: stage === 'transport'
      ? 'Hi Meera! Aarav has fixed Goa for 27–29 Nov. Pick how to travel and where to stay. It takes about 2 minutes.'
      : stage === 'stay' ? 'Sana and Riya like the villa’s pool. Kabir and Dev prefer the homestay because it’s cheaper. Your vote could settle it.'
        : 'Looks good. Once you send, Aarav sees your picks and your comments.',
    replies: stage === 'stay' ? [
      { label: 'Why the villa?', answer: 'It sleeps 6 in 3 rooms and has a private pool. Split 6 ways it costs ₹4,300 each for 2 nights.' },
      { label: 'Why the homestay?', answer: 'It’s the cheapest whole house (₹3,200 each) and very quiet, but 3.5 km from the beach, so you’d rent scooters.' },
    ] : [
      { label: 'Why the train?', answer: 'It’s the cheapest (₹2,360 return), and you sleep on the way, so there’s no extra hotel night.' },
      { label: 'What will I pay?', answer: 'Around ₹6,660 for travel and stay if all 6 go with the train and the villa. Aarav pays when booking; you settle with him.' },
      { label: 'Who has voted?', answer: 'Riya, Kabir, Dev and Sana have voted. You’re the last one.' },
    ],
  }

  return (
    <Planner ctx={ctx} steps={FRIEND_STEPS} current={idx}
      chips={<TripChips ctx={ctx} locked />}
      capsule="Goa · 27–29 Nov · Aarav’s trip"
      banner={<div className="invite"><Avatar who="host" size={30} /> <span><b>Aarav</b> invited you to plan <b>Goa</b> with 5 friends · votes close Wed 25 Nov, 9 pm</span></div>}
      title={title} sub={sub} back={back} actions={actions} myra={myra}>
      {body}
    </Planner>
  )
}

function VoteRow({ on, voters, onVote, children, card }) {
  return (
    <div className={(card ? 'stay-card vote' : 't-row vote') + (on ? ' on' : '')}>
      {card ? <div className="sc-open">{children}</div> : children}
      <div className={card ? 'v-foot' : 't-side'}>
        <span className="v-count">
          <Avatars ids={voters} size={24} />
          <b key={voters.length} className="tick-up">{voters.length}</b> {voters.length === 1 ? 'vote' : 'votes'}
        </span>
        <button className={'pick-btn' + (on ? ' on' : '')} onClick={onVote} aria-pressed={on}>{on ? '✓ Your pick' : 'Pick this'}</button>
      </div>
    </div>
  )
}

function Comments({ ctx, kind, list }) {
  const { s, set } = ctx
  const [text, setText] = useState('')
  const add = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const f = s.friend
    set({ friend: { ...f, comments: { ...f.comments, [kind]: [...f.comments[kind], { who: DEMO_FRIEND, text: text.trim() }] } } })
    setText('')
  }
  return (
    <div className="comments">
      <span className="rail-label">Comments</span>
      {list.map((c, i) => (
        <div key={i} className="cmt"><Avatar who={c.who} size={26} /><p><b>{nameOf(c.who)}</b> {c.text}</p></div>
      ))}
      <form onSubmit={add} className="cmt-form">
        <Avatar who={DEMO_FRIEND} size={26} />
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment for the group" aria-label="Add a comment" />
        <button className="btn" type="submit">Post</button>
      </form>
    </div>
  )
}
