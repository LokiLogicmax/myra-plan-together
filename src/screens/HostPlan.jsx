import { CITIES, EXPERIENCES, WHEN, PARTY, CODES, STAY_WHY, inr, stayPerPerson, stayType } from '../data.js'
import { Compass, MapPin, CalendarBlank, UsersThree, MapTrifold, Train, Bed, CaretDown, Lock } from '@phosphor-icons/react'
import { Scene, ModeIcon } from '../art.jsx'
import { Planner } from './Chrome.jsx'
import { CityGuide } from './CityGuide.jsx'

export const liveTime = () => new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })

const ICON = {
  Trip: <Compass size={15} />, From: <MapPin size={15} />, When: <CalendarBlank size={15} />, Who: <UsersThree size={15} />,
  City: <MapTrifold size={15} />, Transport: <Train size={15} />, Stay: <Bed size={15} />,
}

// The trip so far, laid out like the trip basics bar on the start screen.
// In the planner, a step shows here only once you've moved past it.
const PAST = { city: 1, transport: 2, stay: 3, share: 4 }
export function TripChips({ ctx, locked = false, onEdit, stage }) {
  const past = (step) => !stage || PAST[stage] > PAST[step]
  const { s, city } = ctx
  const b = s.basics
  const exp = EXPERIENCES.find((e) => e.id === b.exp)
  const when = WHEN.find((w) => w.id === b.when)
  const party = PARTY[b.people]
  const items = [
    ['Trip', exp?.label, exp?.sub, 'start', true],
    ['From', b.from, CODES[b.from], 'start'],
    ['When', when?.sub.replace(/^(\w+) (\d+) – (\w+) (\d+) (\w+)$/, '$2–$4 $5'), when ? '2 nights' : '', 'start'],
    ['Who', s.dropout === 'accepted' ? '5 people' : party?.label, party?.sub, 'start'],
    ['City', city?.name, city?.tag, 'city', true],
  ]
  if (!locked && past('transport') && s.shortTransport.length) items.push(['Transport', ctx.group ? `${s.shortTransport.length} in the vote` : 'Chosen', ctx.group ? 'Shortlisted' : '', 'transport'])
  if (!locked && past('stay') && s.shortStay.length) items.push(['Stay', ctx.group ? `${s.shortStay.length} in the vote` : 'Chosen', ctx.group ? 'Shortlisted' : '', 'stay'])
  return items.filter(([, v]) => v).map(([k, v, sub, target, fixed]) => {
    const isLocked = locked && fixed
    const editable = onEdit && !locked
    const inner = (
      <>
        <span className="tf-label">{ICON[k]}{k}{isLocked ? <Lock size={12} weight="bold" aria-label="Fixed by the host" /> : editable ? <CaretDown className="tf-caret" size={11} weight="bold" /> : null}</span>
        <b className="tf-val">{v}</b>
        {sub && <span className="tf-sub">{sub}</span>}
      </>
    )
    return editable
      ? <button key={k} className="tchip tfield" onClick={() => onEdit(target)} aria-label={'Change ' + k}>{inner}</button>
      : <span key={k} className={'tchip tfield' + (isLocked ? ' locked' : '')}>{inner}</span>
  })
}

export function HostPlan({ ctx }) {
  const { s, set, go, city, people } = ctx
  const stageIdx = { city: 1, transport: 2, stay: 3, share: 4 }[s.stage]
  const toStage = (stage, loading = null) => {
    set({ stage, loading, detail: null, thread: [] })
    window.scrollTo({ top: 0 })
  }
  const onEdit = (target) => (target === 'start' ? go('start') : toStage(target))
  const chips = <TripChips ctx={ctx} onEdit={onEdit} stage={s.stage} />
  const capsule = s.loading
    ? { city: 'Checking seasons and travel times…', transport: `Checking live seats for ${people}…`, stay: 'Checking stays free on 27–29 Nov…' }[s.loading]
    : [city?.name, PARTY[s.basics.people]?.label, '27–29 Nov'].filter(Boolean).join(' · ')

  let body, title, sub, actions, myra, back
  if (s.stage === 'city') ({ body, title, sub, actions, myra } = CityStage(ctx, toStage))
  if (s.stage === 'transport') ({ body, title, sub, actions, myra, back } = TransportStage(ctx, toStage))
  if (s.stage === 'stay') ({ body, title, sub, actions, myra, back } = StayStage(ctx, toStage))
  if (s.stage === 'share') ({ body, title, sub, actions, myra, back } = ShareStage(ctx, toStage))

  return (
    <Planner ctx={ctx} steps={ctx.steps} current={stageIdx} chips={chips} capsule={capsule}
      title={title} sub={sub} back={back} actions={actions} myra={myra}>
      {body}
    </Planner>
  )
}

/* ---------- City ---------- */
function CityStage(ctx, toStage) {
  const { s, set, group, people } = ctx
  const chosen = CITIES.find((c) => c.id === s.city)
  const exp = EXPERIENCES.find((e) => e.id === s.basics.exp)
  const when = WHEN.find((w) => w.id === s.basics.when)
  return {
    title: 'Where to?',
    body: s.loading ? <Skeletons n={3} /> : (
      <>
      {chosen && <CityGuide key={chosen.id} city={chosen} />}
      <p className="cg-more">{chosen ? 'Compare cities' : 'Three places for ' + exp?.label.toLowerCase() + ' from ' + s.basics.from}</p>
      <div className="city-grid">
        {CITIES.map((c) => (
          <button key={c.id} className={'city-card' + (s.city === c.id ? ' on' : '')} onClick={() => set({ city: c.id })} aria-pressed={s.city === c.id}>
            <div className="img"><Scene kind={c.art} label={c.name} />{c.pick && <span className="pick">★ Myra’s pick</span>}<span className="radio-dot" /></div>
            <div className="cc-body">
              <div className="cc-top"><b>{c.name}</b><span className="tag">{c.tag}</span></div>
              <ul>
                <li><i>☀</i>{c.weather}</li>
                <li><i>⇄</i>{c.reach}</li>
                <li><i>✦</i>{c.todo.join(' · ')}</li>
              </ul>
              <div className="cc-price"><small>Trip estimate per person</small><b>{c.est}</b></div>
            </div>
          </button>
        ))}
      </div>
      </>
    ),
    actions: (
      <button className="cta" disabled={!chosen || s.loading} onClick={() => toStage('transport', 'transport')}>
        {chosen ? `Fix ${chosen.name} & continue` : 'Pick a city'}
      </button>
    ),
    myra: {
      intro: s.loading
        ? 'Looking at the season, the weather and travel time from ' + s.basics.from + '…'
        : `Here’s what I understood: ${exp?.label}, ${group ? PARTY[s.basics.people]?.label + ' (I’ll plan for 6)' : people === 1 ? 'just you' : 'two of you'}, from ${s.basics.from}, ${when?.sub}. Is that right?`,
      replies: s.loading ? [] : [
        { label: 'Yes, that’s right', answer: group ? 'Great. Pick a city on the left. Once you fix it, friends can’t change it, so the plan doesn’t go round in circles.' : 'Great. Pick a city on the left, and I’ll check seats and stays for ' + (people === 1 ? 'you.' : 'two.') },
        { label: 'Why is Goa your pick?', answer: CITIES[0].why },
        { label: 'Why not Gokarna?', answer: CITIES[1].why },
        { label: 'Change the dates', onClick: () => { ctx.go('start') } },
      ],
    },
  }
}

/* ---------- Transport ---------- */
function TransportStage(ctx, toStage) {
  const { s, set, transportList, toast, group, people } = ctx
  const toggle = (id) => {
    const has = s.shortTransport.includes(id)
    if (!group) return set({ shortTransport: has ? [] : [id] })
    if (!has && s.shortTransport.length >= 3) return toast('You can send up to 3 options. Remove one first.')
    set({ shortTransport: has ? s.shortTransport.filter((x) => x !== id) : [...s.shortTransport, id] })
  }
  const t = liveTime()
  const n = s.shortTransport.length
  return {
    title: 'How do you get there?',
    sub: `${ctx.city?.name} from ${s.basics.from}. Prices are per person for the return trip. ` + (group ? 'Shortlist up to 3, and friends will vote on them.' : 'Choose one.'),
    back: { label: 'City', onClick: () => toStage('city') },
    body: s.loading ? <Skeletons n={4} rows /> : (
      <div className="t-list">
        <p className="live">● Seats checked live at {t}</p>
        {transportList.map((o) => {
          const on = s.shortTransport.includes(o.id)
          return (
            <div key={o.id} className={'t-row' + (on ? ' on' : '') + (o.soldOut ? ' sold' : '')}>
              <div className="t-ic"><ModeIcon mode={o.mode} /></div>
              <div className="t-main">
                <div className="t-title"><b>{o.title}</b>{o.pick && <span className="pick inline">★ Myra’s pick</span>}</div>
                <div className="t-route">{o.route}</div>
                <div className="t-times"><b>{o.dep}</b><span className="dur">{o.dur}</span><b>{o.arr}</b></div>
                <div className="t-back">{o.back}</div>
                {o.warn && <div className="warn">⚠ {o.warn}</div>}
                {o.pick && <div className="why">“{o.why}”</div>}
                {o.soldOut && (
                  <div className="sold-msg">
                    {group ? <>Sold out for 6 just now: {o.seats.toLowerCase()}.</> : <>Only {o.seats.toLowerCase().replace('only ', '')}, filling fast.</>}{' '}
                    <button className="link" onClick={() => { set({ altShown: true }); toast('Swapped in the 9:30 pm bus, which has more berths free.') }}>Show the 9:30 pm bus instead</button>
                  </div>
                )}
              </div>
              <div className="t-side">
                <b className="price">{inr(o.price)}</b>
                <small>per person</small>
                {!o.soldOut && <span className="seats">✓ {group ? o.seats : 'Seats available'}</span>}
                <button className={'pick-btn' + (on ? ' on' : '')} disabled={o.soldOut} onClick={() => toggle(o.id)} aria-pressed={on}>
                  {group ? (on ? '✓ In the vote' : '+ Add to vote') : (on ? '✓ Chosen' : 'Choose')}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    ),
    actions: (
      <button className="cta" disabled={!n || s.loading} onClick={() => toStage('stay', 'stay')}>
        {group ? (n ? `Next: stay (${n} in the vote)` : 'Add at least 1 option') : (n ? 'Next: stay' : 'Choose how you travel')}
      </button>
    ),
    myra: {
      intro: s.loading ? `Checking which trains, flights and buses still have ${people === 1 ? 'a seat' : people + ' seats together'}…`
        : 'The overnight train is my pick: cheapest, and you arrive Friday morning without paying for an extra night. Careful with the Mopa flight if you stay in South Goa.',
      replies: s.loading ? [] : [
        group
          ? { label: 'Add Myra’s picks', onClick: () => { set({ shortTransport: ['t1', 't2'] }); ctx.say('Add Myra’s picks', 'Added the train and the Dabolim flight. One cheap, one fast, so friends have a real choice.') } }
          : { label: 'Choose Myra’s pick', onClick: () => { set({ shortTransport: ['t1'] }); ctx.say('Choose Myra’s pick', 'Chosen: the overnight train. You arrive Friday morning, rested.') } },
        { label: 'Why not fly?', answer: 'Flying saves about 11 hours, but costs ₹6,940 more each and needs a 4 am start. Worth adding as the second option.' },
        { label: 'Which airport?', answer: 'Dabolim (GOI) is central. Mopa (GOX) is in the north: fine for Anjuna, but 2 hours from South Goa.' },
      ],
    },
  }
}

/* ---------- Stay ---------- */
function StayStage(ctx, toStage) {
  const { s, set, stays, toast, people, group, stayPick, mode, go } = ctx
  const toggle = (id) => {
    const has = s.shortStay.includes(id)
    if (!group) return set({ shortStay: has ? [] : [id] })
    if (!has && s.shortStay.length >= 3) return toast('You can send up to 3 options. Remove one first.')
    set({ shortStay: has ? s.shortStay.filter((x) => x !== id) : [...s.shortStay, id] })
  }
  const n = s.shortStay.length
  const detail = stays.find((x) => x.id === s.detail)

  if (detail) {
    const on = s.shortStay.includes(detail.id)
    return {
      title: detail.name,
      sub: `${stayType(detail, mode)} · ${detail.area}, Goa · 27–29 Nov, 2 nights`,
      back: { label: 'Stay', onClick: () => set({ detail: null, thread: [] }) },
      body: (
        <div className="detail">
          <div className="d-hero"><Scene kind={detail.art} label={detail.name} />{detail.id === stayPick && <span className="pick">★ Myra’s pick</span>}</div>
          <div className="d-thumbs"><Scene kind="beach" label="Nearby beach" /><Scene kind={detail.art} label="Rooms" /><Scene kind="homestay" label="Garden" /></div>
          <div className="d-cols">
            <div>
              <div className="rating"><span className="score">{detail.rating}</span> <b>Very good</b> <small>{detail.reviews.toLocaleString('en-IN')} ratings</small></div>
              {detail.id === stayPick && <p className="why big">“{group ? detail.why : STAY_WHY[mode]}”</p>}
              <p className="review">{detail.review}</p>
              <div className="amen">{detail.amen.map((a) => <span key={a}>{a}</span>)}</div>
              <p className="loc">📍 {detail.beach}</p>
            </div>
            <div className="d-price card">
              <small>{group ? 'Per person, 2 nights, if 6 go' : people === 1 ? 'For you, 2 nights' : 'Per person, 2 nights, for two'}</small>
              <b className="price">{inr(stayPerPerson(detail, people))}</b>
              <span className="seats">✓ Free on 27–29 Nov · checked {liveTime()}</span>
              <span className="free-cancel">Free cancellation till 24 Nov</span>
            </div>
          </div>
        </div>
      ),
      actions: (
        <button className={'cta' + (on ? ' ghost' : '')} onClick={() => toggle(detail.id)}>
          {group ? (on ? '✓ In the vote · remove' : '+ Add to friends’ vote') : (on ? '✓ Chosen · undo' : 'Choose this stay')}
        </button>
      ),
      myra: {
        intro: detail.id === stayPick ? (group ? detail.why : STAY_WHY[mode]) : `${detail.name}: ${detail.beach}. Rated ${detail.rating} by ${detail.reviews.toLocaleString('en-IN')} guests.`,
        replies: [
          { label: 'Is it really free?', answer: `Yes. I checked ${detail.name} for 27–29 Nov at ${liveTime()}. I’ll check again right before booking.` },
          { label: 'Compare with the villa', answer: 'Casa Azul has a private pool and fits 6 in 3 rooms. Fig Tree is cheaper and quieter but 3.5 km from the beach.' },
        ],
      },
    }
  }

  return {
    title: 'Where do you stay?',
    sub: group ? 'Free on 27–29 Nov for 6 people. Prices are per person for 2 nights. Shortlist up to 3 for the vote.' : `Free on 27–29 Nov for ${people === 1 ? 'one' : 'two'}. Prices are per person for 2 nights. Choose one.`,
    back: { label: 'Transport', onClick: () => toStage('transport') },
    body: s.loading ? <Skeletons n={4} /> : (
      <>
        <div className="seg" role="tablist">
          <button role="tab" aria-selected={s.stayView === 'grid'} className={s.stayView === 'grid' ? 'on' : ''} onClick={() => set({ stayView: 'grid' })}>Grid</button>
          <button role="tab" aria-selected={s.stayView === 'map'} className={s.stayView === 'map' ? 'on' : ''} onClick={() => set({ stayView: 'map' })}>Map</button>
        </div>
        {s.stayView === 'map' && <StayMap ctx={ctx} />}
        <div className="stay-grid">
          {stays.map((x) => {
            const on = s.shortStay.includes(x.id)
            return (
              <div key={x.id} className={'stay-card' + (on ? ' on' : '')}>
                <button className="sc-open" onClick={() => set({ detail: x.id, thread: [] })} aria-label={'Open ' + x.name}>
                  <div className="img"><Scene kind={x.art} label={x.name} />{x.id === stayPick && <span className="pick">★ Myra’s pick</span>}</div>
                  <div className="sc-body">
                    <b>{x.name}</b>
                    <span className="area">{x.area} · {stayType(x, mode)}</span>
                    <span className="rating-sm"><span className="score">{x.rating}</span> {x.reviews.toLocaleString('en-IN')} ratings</span>
                    <span className="loc">{x.beach}</span>
                    <span className="sc-price"><b>{inr(stayPerPerson(x, people))}</b> <small>per person</small></span>
                  </div>
                </button>
                <button className={'box' + (on ? ' on' : '')} onClick={() => toggle(x.id)} aria-pressed={on} aria-label={group ? (on ? 'Remove ' : 'Add ') + x.name + ' to the vote' : (on ? 'Unchoose ' : 'Choose ') + x.name}>{on ? '✓' : '+'}</button>
              </div>
            )
          })}
        </div>
      </>
    ),
    actions: (
      group ? (
        <button className="cta" disabled={!n || s.loading} onClick={() => toStage('share')}>
          {n ? `Next: share (${n} in the vote)` : 'Add at least 1 stay'}
        </button>
      ) : (
        <button className="cta" disabled={!n || !s.shortTransport.length || s.loading} onClick={() => go('approve', { final: { transport: s.shortTransport[0], stay: s.shortStay[0] } })}>
          {n ? 'Review & book' : 'Choose a stay'}
        </button>
      )
    ),
    myra: {
      intro: s.loading ? `Checking which stays are free for ${people} on 27–29 Nov…`
        : group ? 'Casa Azul Villa is my pick: it sleeps 6 in 3 rooms, has a pool, and costs less each than 3 hotel rooms. Fig Tree is the cheaper, quieter option.' : STAY_WHY[mode],
      replies: s.loading ? [] : [
        group
          ? { label: 'Add Myra’s picks', onClick: () => { set({ shortStay: ['s1', 's4'] }); ctx.say('Add Myra’s picks', 'Added Casa Azul and Fig Tree. A pool villa against a cheaper homestay: an easy vote.') } }
          : { label: 'Choose Myra’s pick', onClick: () => { set({ shortStay: [stayPick] }); ctx.say('Choose Myra’s pick', 'Chosen. I’ll re-check it is still free right before you pay.') } },
        { label: 'Show me on a map', onClick: () => set({ stayView: 'map' }) },
        { label: 'Anything cheaper?', answer: group ? 'Lazy Gecko Hostel is the cheapest at ₹1,900 each for 2 nights, 400 m from the beach. It’s a shared 6-bed room, though.' : 'Lazy Gecko Hostel is the cheapest at ₹1,900 each for 2 nights, 400 m from the beach.' },
      ],
    },
  }
}

function StayMap({ ctx }) {
  const { stays, set, people } = ctx
  return (
    <div className="map card" aria-label="Map of North Goa">
      <svg viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true">
        <rect width="100" height="70" fill="#E8F1E4" />
        <path d="M0 0 L18 0 Q10 20 16 35 Q8 50 14 70 L0 70Z" fill="#B9DDF0" />
        <path d="M30 10 Q50 30 45 70" stroke="#fff" strokeWidth="1.6" fill="none" />
        <path d="M18 40 Q50 45 100 30" stroke="#fff" strokeWidth="1.2" fill="none" />
      </svg>
      <span className="map-lbl" style={{ left: '3%', top: '18%' }}>Arabian Sea</span>
      <span className="map-lbl" style={{ left: '20%', top: '60%' }}>Anjuna</span>
      <span className="map-lbl" style={{ left: '62%', top: '25%' }}>Assagao</span>
      {stays.map((x) => (
        <button key={x.id} className={'pin' + (x.id === ctx.stayPick ? ' pick' : '')} style={{ left: x.map.x + '%', top: x.map.y + '%' }} onClick={() => set({ detail: x.id, thread: [] })}>
          {inr(stayPerPerson(x, people))}
        </button>
      ))}
    </div>
  )
}

/* ---------- Share ---------- */
function ShareStage(ctx, toStage) {
  const { s, go, toast, allTransport, stays } = ctx
  const tOpts = allTransport.filter((t) => s.shortTransport.includes(t.id))
  const sOpts = stays.filter((x) => s.shortStay.includes(x.id))
  const msg = `Goa, 27–29 Nov! 🏖️ I’ve fixed the city. Pick how we travel and where we stay. Takes 2 minutes, votes close Wed 25 Nov, 9 pm.`
  return {
    title: 'Share with friends',
    sub: 'One link for everyone. Friends don’t need to log in. They can’t change the city, but they vote on transport and stay and can comment.',
    back: { label: 'Stay', onClick: () => toStage('stay') },
    body: (
      <div className="share">
        <div className="share-preview card">
          <span className="rail-label">What friends will see</span>
          <ul className="share-list">
            <li><span>🔒</span><b>Goa · Beaches & chill</b><small>Fixed by you</small></li>
            <li><span>🚆</span><b>Transport</b><small>{tOpts.map((t) => t.title.split(' · ')[0]).join(' or ')}</small></li>
            <li><span>🏡</span><b>Stay</b><small>{sOpts.map((x) => x.name).join(' or ')}</small></li>
          </ul>
        </div>
        <div className="wa card">
          <span className="rail-label">Message (written by Myra, edit if you like)</span>
          <div className="wa-bubble">
            <p contentEditable suppressContentEditableWarning>{msg}</p>
            <div className="link-card">
              <Scene kind="beach" label="Goa" />
              <span><b>Plan Goa with Aarav</b><small>makemytrip.com/myra/t/GOA-7K2</small></span>
            </div>
          </div>
          <div className="share-btns">
            <button className="btn wa-btn" onClick={() => toast('WhatsApp would open here (not in this prototype).')}>Share on WhatsApp</button>
            <button className="btn" onClick={() => toast('Link copied (demo).')}>Copy link</button>
          </div>
          <p className="deadline">⏱ Votes close <b>Wed 25 Nov, 9 pm</b>. Myra reminds anyone who hasn’t voted the evening before.</p>
        </div>
      </div>
    ),
    actions: (
      <>
        <button className="btn ghost" onClick={() => go('review')}>Skip to results</button>
        <button className="cta" onClick={() => go('friend', { friend: { ...s.friend, stage: 'transport' } })}>Open as a friend (demo)</button>
      </>
    ),
    myra: {
      intro: 'I’ve written the message for the group. When friends vote, I’ll sum it up for you, so you don’t have to chase anyone on WhatsApp.',
      replies: [
        { label: 'What if someone drops out?', answer: 'You set a range of 5–6, so the plan still works with 5. I’ll show the new price per person before anything is booked.' },
        { label: 'Can they change the city?', answer: 'No. You fixed Goa. They choose transport and stay, and can comment on anything.' },
      ],
    },
  }
}

export function Skeletons({ n = 3, rows }) {
  return (
    <div className={rows ? 'sk-rows' : 'sk-grid'} aria-busy="true" aria-label="Loading">
      {Array.from({ length: n }).map((_, i) => <div key={i} className="sk" />)}
    </div>
  )
}
