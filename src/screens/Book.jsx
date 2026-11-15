import { useState } from 'react'
import { inr, stayTotal, stayPerPerson, stayType } from '../data.js'
import { MyraOrb, Scene } from '../art.jsx'
import { Planner, Avatars } from './Chrome.jsx'
import { TripChips, liveTime } from './HostPlan.jsx'

function useBooking(ctx) {
  const { s, allTransport, stays, people } = ctx
  const T = allTransport.find((t) => t.id === s.final.transport)
  const S = stays.find((x) => x.id === s.final.stay)
  const travel = (T?.price || 0) * people
  const stay = stayTotal(S, people)
  return { T, S, travel, stay, total: travel + stay, each: (T?.price || 0) + stayPerPerson(S, people) }
}

export function Approve({ ctx }) {
  const { set, go, people, going, group, steps } = ctx
  const b = useBooking(ctx)
  const back = group ? () => go('review') : () => go('plan', { stage: 'stay' })
  if (!b.T || !b.S) return <div className="empty card"><h2>Pick transport and stay first</h2><button className="cta" onClick={back}>Go back</button></div>
  return (
    <Planner ctx={ctx} steps={steps} current={steps.length - 1}
      chips={<TripChips ctx={ctx} />}
      capsule={`Ready to book · ${inr(b.total)}`}
      title="Here’s exactly what I’ll book"
      sub="Nothing is booked until you approve. Check it, change anything, then pay."
      back={{ label: group ? 'Results' : 'Stay', onClick: back }}
      actions={<><button className="btn ghost" onClick={back}>Change something</button><button className="cta" onClick={() => set({ pay: 'open' })}>Approve & pay {inr(b.total)}</button></>}
      myra={{
        intro: `I re-checked both at ${liveTime()}: the seats and ${b.S.name} are still free. If anything changes before you pay, I’ll stop and tell you.`,
        replies: [
          { label: 'Can we cancel later?', answer: `${b.S.name} has free cancellation till 24 Nov. Train tickets follow railway rules: cancelling more than 48 hours before departure costs about ₹240 each.` },
          { label: 'Who are the travellers?', answer: group ? 'You, Kabir, Meera, Dev and Sana. Each added their name and age through the link when they voted.' : people === 1 ? 'Just you. Your name and age come from your MakeMyTrip profile.' : 'You and one more. Add their name and age at payment, or pick them from your saved travellers.' },
        ],
      }}
    >
      <div className="intent">
        <div className="i-row">
          <span className="i-ic">🚆</span>
          <div className="i-main">
            <b>{people} × {b.T.title}</b>
            <small>{b.T.route}</small>
            <small>Out: {b.T.dep} → {b.T.arr}</small>
            <small>{b.T.back}</small>
          </div>
          <span className="i-amt">{inr(b.travel)}</span>
        </div>
        <div className="i-row">
          <span className="i-ic img"><Scene kind={b.S.art} label={b.S.name} /></span>
          <div className="i-main">
            <b>{b.S.name}, {b.S.area}</b>
            <small>{stayType(b.S, ctx.mode)} · Fri 27 – Sun 29 Nov · 2 nights</small>
            <small className="ok">Free cancellation till 24 Nov</small>
          </div>
          <span className="i-amt">{inr(b.stay)}</span>
        </div>
        <div className="i-row travellers">
          <span className="i-ic">{people === 1 ? '👤' : '👥'}</span>
          <div className="i-main"><b>{people === 1 ? '1 traveller' : people + ' travellers'}</b><span className="tr-avs"><Avatars ids={['host', ...going.map((g) => g.id)].slice(0, people)} size={26} /></span></div>
        </div>
        <div className="i-total">
          <span>Total</span><b>{inr(b.total)}</b>
          <small>{people === 1 ? '' : inr(b.each) + ' per person · '}includes taxes and fees, no extra charges at payment</small>
        </div>
      </div>
    </Planner>
  )
}

export function PaySheet({ ctx }) {
  const { s, set, go } = ctx
  const b = useBooking(ctx)
  const [method, setMethod] = useState('upi')
  const pay = () => {
    set({ pay: 'paying' })
    setTimeout(() => { set({ pay: null }); go('booked') }, 1600)
  }
  return (
    <div className="overlay" onClick={() => s.pay === 'open' && set({ pay: null })}>
      <div className="sheet" role="dialog" aria-label="Payment" onClick={(e) => e.stopPropagation()}>
        {s.pay === 'paying' ? (
          <div className="paying"><span className="spin" /><b>Confirming your booking…</b><small>Don’t close this page</small></div>
        ) : (
          <>
            <div className="sheet-head"><b>Pay {inr(b.total)}</b><button onClick={() => set({ pay: null })} aria-label="Close">✕</button></div>
            <p className="sheet-sub">Goa trip · {b.T?.title} + {b.S?.name}</p>
            {[['upi', 'UPI', 'Pay with any UPI app'], ['card', 'Credit / Debit card', 'Saved cards and EMI'], ['nb', 'Net banking', 'All major banks']].map(([id, l, sub]) => (
              <label key={id} className={'pay-opt' + (method === id ? ' on' : '')}>
                <input type="radio" name="pm" checked={method === id} onChange={() => setMethod(id)} />
                <span><b>{l}</b><small>{sub}</small></span>
              </label>
            ))}
            <p className="sheet-note">Payment is simulated in this prototype. No details are asked for and nothing is charged.</p>
            <button className="cta big full" onClick={pay}>Pay {inr(b.total)}</button>
          </>
        )}
      </div>
    </div>
  )
}

export function Booked({ ctx }) {
  const { toast, go, people, group } = ctx
  const b = useBooking(ctx)
  return (
    <div className="booked">
      <div className="booked-card card">
        <div className="confetti" aria-hidden="true">{Array.from({ length: 14 }).map((_, i) => <i key={i} style={{ '--i': i }} />)}</div>
        <div className="done-ic">✓</div>
        <h1>You’re going to Goa!</h1>
        <p>Booked for {people === 1 ? 'you' : people === 2 ? 'two' : people} · Fri 27 – Sun 29 Nov</p>
        <div className="tickets">
          <div><span>🚆</span><b>{b.T?.title}</b><small>PNR 482-1937650 · {b.T?.dep}</small></div>
          <div><span>🏡</span><b>{b.S?.name}</b><small>Booking ID MMT-GOA-7K2 · check-in Fri 27, 12 pm</small></div>
        </div>
        <div className="paid"><span>Paid</span><b>{inr(b.total)}</b><small>{people === 1 ? 'Includes taxes and fees.' : inr(b.each) + ' per person.' + (group ? ' Splitting the cost with friends isn’t part of this prototype.' : '')}</small></div>
        <div className="booked-btns">
          <button className="cta" onClick={() => toast(group ? 'Trip details shared with the group (demo).' : 'Trip details shared (demo).')}>{group ? 'Share with the group' : people === 1 ? 'Share trip details' : 'Share with your travel partner'}</button>
          <button className="btn" onClick={() => go('home')}>Back to home</button>
        </div>
        <div className="myra-next"><MyraOrb size={24} /><p>I’ll send {group ? 'everyone' : people === 1 ? 'you' : 'you both'} the PNR, the stay’s location and a reminder the day before you leave. The days in Goa are yours to fill as you go.</p></div>
      </div>
    </div>
  )
}
