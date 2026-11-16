import { HOST_STEPS, BUDGET, inr, stayPerPerson } from '../data.js'
import { Scene, ModeIcon, MyraOrb } from '../art.jsx'
import { Planner, Avatars, Avatar, nameOf } from './Chrome.jsx'
import { TripChips } from './HostPlan.jsx'

export function Review({ ctx }) {
  const { s, set, go, allTransport, stays, votes, comments, people, going } = ctx

  if (!s.shortTransport.length || !s.shortStay.length) {
    return <div className="empty card"><h2>No votes yet</h2><p>Shortlist transport and stays first, then share the link.</p><button className="cta" onClick={() => go('plan', { stage: 'transport' })}>Back to planning</button></div>
  }

  const tallyOf = (kind) => {
    const by = {}
    for (const [who, id] of Object.entries(votes[kind])) (by[id] ||= []).push(who)
    return by
  }
  const leader = (kind, ids) => {
    const by = tallyOf(kind)
    const sorted = ids.map((id) => [id, (by[id] || []).length]).sort((a, b) => b[1] - a[1])
    const tie = sorted.length > 1 && sorted[0][1] === sorted[1][1]
    return { by, top: sorted[0]?.[0], tie }
  }
  const tr = leader('transport', s.shortTransport)
  const st = leader('stay', s.shortStay)
  const finalT = s.final.transport ?? (tr.tie ? null : tr.top)
  const finalS = s.final.stay ?? (st.tie ? null : st.top)
  const setFinal = (k, id) => set({ final: { ...s.final, [k]: id } })

  const voted = new Set([...Object.keys(votes.transport), ...Object.keys(votes.stay)])
  const waiting = going.filter((f) => !voted.has(f.id))

  const T = allTransport.find((t) => t.id === finalT)
  const S = stays.find((x) => x.id === finalS)
  const pp = (n) => (T?.price || 0) + stayPerPerson(S, n)

  // What one person dropping out does to everyone's share, and to the budget.
  const bud = BUDGET.find((b) => b.id === s.basics.budget)
  const Tlead = allTransport.find((t) => t.id === tr.top) || allTransport.find((t) => t.id === s.shortTransport[0])
  const tPrice = (T || Tlead)?.price || 0
  const costRows = s.shortStay.map((id) => stays.find((x) => x.id === id)).map((x) => {
    const total = tPrice + stayPerPerson(x, 5)
    return { id: x.id, name: x.name, flat: x.pricing === 'flat', six: stayPerPerson(x, 6), five: stayPerPerson(x, 5), total, over: !!bud && bud.max !== Infinity && total > bud.max }
  })
  const fit = costRows.filter((r) => !r.over).sort((a, b) => a.total - b.total)
  const rises = costRows.filter((r) => r.five > r.six)
  const dropTip = costRows.some((r) => r.over)
    ? (fit.length ? `${costRows.filter((r) => r.over).map((r) => r.name).join(' and ')} now go${costRows.filter((r) => r.over).length > 1 ? '' : 'es'} over your ${bud.big} budget. ${fit[0].name} still fits at ${inr(fit[0].total)} each, so I’d steer the vote there.` : `Every shortlisted stay is now over your ${bud.big} budget. Raise the budget, or I can add a cheaper stay to the vote.`)
    : rises.length
      ? `${rises.map((r) => r.name).join(' and ')} cost${rises.length > 1 ? '' : 's'} a bit more each with 5, but everything still fits your ${bud?.big || ''} budget. Update to 5 so the split is right.`
      : 'Nobody pays more. Update to 5 so the tickets and the split are right.'

  const dropBanner = s.dropout === 'pending' && (
    <div className="dropout card" role="alert">
      <div className="drop-head"><Avatar who="riya" size={34} /><div><b>Riya can’t make it anymore</b><small>Just now · “So sorry, work trip got moved 😞”</small></div></div>
      <div className="drop-body">
        <MyraOrb size={26} />
        <div>
          <p><b>The trip still works with 5.</b> You set a range of 5–6 at the start, so nothing needs to change except the split.</p>
          <ul>
            {(Tlead || T) && <li>{(T || Tlead).title}: 5 tickets instead of 6. Nothing is booked yet, so no cancellation fee.</li>}
          </ul>
          <div className="drop-cost">
            <div className="dc-head"><span>Stay</span><span>Each, if 6</span><span>Each, if 5</span><span>With {(T || Tlead).title.split(' · ')[0].toLowerCase()}</span></div>
            {costRows.map((r) => (
              <div key={r.id} className={'dc-row' + (r.over ? ' over' : '')}>
                <span><b>{r.name}</b><small>{r.flat ? 'Whole place, split by 5' : 'Per bed or room, no change'}</small></span>
                <span>{inr(r.six)}</span>
                <span>{inr(r.five)}{r.five > r.six && <em>+{inr(r.five - r.six)}</em>}</span>
                <span><b>{inr(r.total)}</b>{bud && bud.max !== Infinity && <small className={r.over ? 'no' : 'ok'}>{r.over ? 'Over ' + bud.big + ' by ' + inr(r.total - bud.max) : 'Within ' + bud.big}</small>}</span>
              </div>
            ))}
          </div>
          <p className="drop-tip"><b>Myra suggests:</b> {dropTip}</p>
        </div>
      </div>
      <div className="drop-btns">
        <button className="btn" onClick={() => set({ dropout: 'kept' })}>Keep 6 for now</button>
        <button className="cta" onClick={() => set({ dropout: 'accepted' })}>Update to 5 people</button>
      </div>
    </div>
  )

  const section = (kind, ids, list, info, final) => (
    <div className="res-sec">
      <div className="res-head">
        <h2>{kind === 'transport' ? 'Transport' : 'Stay'}</h2>
        {info.tie && !final ? <span className="split">Split vote · you decide</span> : <span className="agree">{info.tie ? 'Split vote · settled by you' : 'Clear favourite'}</span>}
      </div>
      {ids.map((id) => {
        const o = list.find((x) => x.id === id)
        const v = info.by[id] || []
        const pct = going.length ? Math.round((v.length / going.length) * 100) : 0
        const on = final === id
        return (
          <label key={id} className={'res-row' + (on ? ' on' : '')}>
            <input type="radio" name={kind} checked={on} onChange={() => setFinal(kind, id)} />
            <span className="res-ic">{kind === 'transport' ? <ModeIcon mode={o.mode} /> : <Scene kind={o.art} label={o.name} />}</span>
            <span className="res-main">
              <b>{kind === 'transport' ? o.title : o.name}{o.pick && <span className="pick inline">★ Myra’s pick</span>}</b>
              <span className="bar"><i style={{ width: pct + '%' }} /></span>
              <span className="who"><Avatars ids={v} size={22} /> {v.length ? v.map(nameOf).join(', ') : 'No votes'}</span>
            </span>
            <span className="res-price">{inr(kind === 'transport' ? o.price : stayPerPerson(o, people))}<small>per person</small></span>
          </label>
        )
      })}
      <div className="res-cmts">
        {comments[kind].map((c, i) => <p key={i}><Avatar who={c.who} size={20} /> <b>{nameOf(c.who)}:</b> {c.text}</p>)}
      </div>
    </div>
  )

  const ready = finalT && finalS && s.dropout && s.dropout !== 'pending'
  const trainVotes = (tr.by.t1 || []).length

  return (
    <Planner ctx={ctx} steps={HOST_STEPS} current={5}
      chips={<TripChips ctx={ctx} onEdit={() => {}} />}
      capsule={s.dropout === 'pending' ? 'Riya dropped out · recalculating' : `${voted.size} of ${going.length} voted`}
      banner={dropBanner}
      title="Here’s what everyone picked"
      sub={waiting.length ? `${voted.size} of ${going.length} have voted. Waiting for ${waiting.map((w) => w.name).join(', ')}.` : `All ${going.length} friends voted. You make the final call.`}
      back={{ label: 'Share', onClick: () => go('plan', { stage: 'share' }) }}
      actions={
        <button className="cta" disabled={!ready} onClick={() => go('approve', { final: { transport: finalT, stay: finalS } })}>
          {!s.dropout || s.dropout === 'pending' ? 'Sort out Riya first' : !finalT || !finalS ? 'Settle the split vote' : `Review booking · ${inr(pp(people))} each`}
        </button>
      }
      myra={{
        intro: `${trainVotes} of ${Object.keys(votes.transport).length} want the train. The stay is ${st.tie ? 'split' : 'leaning one way'}: some want the villa’s pool, others the cheaper homestay. ${waiting.length ? `${waiting.map((w) => w.name).join(' and ')} hasn’t voted yet.` : ''}`,
        replies: [
          ...(waiting.length ? [{ label: `Nudge ${waiting[0].name}`, onClick: () => ctx.toast(`Reminder sent to ${waiting[0].name} on WhatsApp (demo).`) }] : []),
          { label: 'Settle it for me', onClick: () => {
            const myraPick = (ids, list) => ids.find((id) => list.find((x) => x.id === id)?.pick) || ids[0]
            set({ final: { transport: tr.tie ? myraPick(s.shortTransport, allTransport) : tr.top, stay: st.tie ? myraPick(s.shortStay, stays) : st.top } })
            ctx.say('Settle it for me', 'I’ve picked what most people voted for, and my own pick wherever the vote was split. You can still change either one.')
          } },
          { label: 'What did people say?', answer: 'Dev is fine sleeping on the train. Riya wanted the flight. Kabir prefers the calmer homestay; Sana really wants a pool.' },
        ],
      }}
    >
      {section('transport', s.shortTransport, allTransport, tr, finalT)}
      {section('stay', s.shortStay, stays, st, finalS)}
      {s.dropout === 'accepted' && <p className="note-ok">✓ Updated to 5 people. Riya has been told, and the price is split 5 ways.</p>}
      {waiting.some((w) => w.id === 'meera') && <p className="note-wait">Meera hasn’t voted. Open the friend’s view from the footer to vote as her.</p>}
    </Planner>
  )
}
