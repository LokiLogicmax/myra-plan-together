import { Icon, MyraOrb, Scene } from '../art.jsx'
import { Suitcase, SealPercent, Compass } from '@phosphor-icons/react'

const TABS = [
  ['flight', 'Flights'], ['hotel', 'Hotels'], ['villa', 'Villas & Homestays'], ['holiday', 'Holiday Packages'],
  ['train', 'Trains'], ['bus', 'Buses'], ['cab', 'Cabs'], ['tours', 'Tours & Attractions'], ['visa', 'Visa'],
  ['forex', 'Forex Card & Currency'], ['insurance', 'Travel Insurance'],
]

export function Home({ ctx }) {
  const start = () => ctx.go('start')
  return (
    <>
      {/* Website */}
      <div className="home-desk">
        <div className="hero-bg"><Scene kind="hills" label="Mountains at dusk" /></div>
        <div className="home-card card">
          <div className="tabs">
            <button className="tab myra-tab" onClick={start}>
              <span className="new">new</span>
              <MyraOrb size={40} />
              <span>Plan with Myra</span>
            </button>
            {TABS.map(([ic, label], i) => (
              <button key={label} className={'tab' + (i === 0 ? ' on' : '')}>
                <Icon name={ic} size={50} />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="fare-row">
            <label className="radio on"><span />One Way</label>
            <label className="radio"><span />Round Trip</label>
            <label className="radio"><span />Multi City</label>
            <span className="fare-note">Book Domestic & International Flights</span>
          </div>
          <div className="search-grid">
            <div><small>From</small><b>Bengaluru</b><em>BLR, Kempegowda International Airport</em></div>
            <div><small>To</small><b>Goa</b><em>GOI, Dabolim Airport</em></div>
            <div><small>Departure ⌄</small><b>27 <span>Nov'26</span></b><em>Friday</em></div>
            <div><small>Return ⌄</small><em className="muted">Tap to add a return date for bigger discounts</em></div>
            <div><small>Travellers & Class ⌄</small><b>1 <span>Traveller</span></b><em>Economy/Premium Economy</em></div>
          </div>
          <div className="search-wrap"><button className="cta big">Search</button></div>
        </div>

        <div className="strip card">
          <button onClick={start} className="strip-myra"><MyraOrb size={26} /><span><b>Plan with Myra</b> <i className="new">new</i><small>Pick a vibe. Myra plans the rest.</small></span></button>
          <span><b>Where2Go</b><small>Find places by theme</small></span>
          <span><b>How2Go</b><small>Find routes to anywhere</small></span>
          <span><b>MICE</b><small>Offsites, Events & Meetings</small></span>
        </div>

        <MyraBanner onClick={start} />
      </div>

      {/* App */}
      <div className="home-app">
        <div className="app-tiles">
          {[['flight', 'Flights'], ['hotel', 'Hotels'], ['train', 'Trains'], ['holiday', 'Holiday Packages']].map(([ic, l]) => (
            <button key={l} className="tile"><Icon name={ic} size={52} /><b>{l}</b></button>
          ))}
        </div>
        <MyraBanner onClick={start} compact />
        <div className="app-grid card">
          {[['cab', 'Airport Cabs'], ['villa', 'Villas & Homestays'], ['bus', 'Bus'], ['cab', 'Outstation Cabs'], ['tours', 'Tours & Attractions'], ['hotel', 'Hourly Stays'], ['forex', 'Forex Card & Currency'], ['visa', 'Visa'], ['insurance', 'Travel Insurance']].map(([ic, l]) => (
            <span key={l}><Icon name={ic} size={44} />{l}</span>
          ))}
        </div>
        <nav className="bottom-nav">
          <span className="on"><i className="my">my</i>Home</span>
          <span><Suitcase size={22} weight="duotone" />My Trips</span>
          <button onClick={start} className="nav-orb" aria-label="Plan with Myra"><MyraOrb size={50} /></button>
          <span><SealPercent size={22} weight="duotone" />Offers</span>
          <span><Compass size={22} weight="duotone" />Where2Go</span>
        </nav>
      </div>
    </>
  )
}

function MyraBanner({ onClick, compact }) {
  return (
    <button className={'myra-banner' + (compact ? ' compact' : '')} onClick={onClick}>
      <span className="mb-text">
        <span className="mb-kicker">NEW · PLAN WITH MYRA</span>
        <span className="mb-title">Not sure where to go?</span>
        <span className="mb-sub">Pick a vibe and tap your way through. Myra finds the place, the travel and the stay, and books when you say yes.</span>
        <span className="mb-cta">Start planning →</span>
      </span>
      <span className="mb-art"><Scene kind="beach" label="Beach" /></span>
    </button>
  )
}
