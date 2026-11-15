import { useState } from 'react'
import { Airplane, Train, Car, CalendarCheck, Clock, Thermometer, Translate, Lightbulb, MapPin, Bed } from '@phosphor-icons/react'
import { CITY_GUIDE, MONTHS } from '../cityGuide.js'

const TABS = [['overview', 'Overview'], ['reach', 'How to reach'], ['todo', 'Things to do'], ['stay', 'Where to stay']]
const FACT_ICON = [<CalendarCheck size={18} />, <Clock size={18} />, <Thermometer size={18} />, <Translate size={18} />]
const REACH_ICON = { flight: <Airplane size={20} />, train: <Train size={20} />, road: <Car size={20} /> }

// Where2Go-style destination detail for the city that's selected.
export function CityGuide({ city }) {
  const g = CITY_GUIDE[city.id]
  const [tab, setTab] = useState('overview')
  if (!g) return null
  return (
    <section className="cg" aria-label={'About ' + city.name}>
      <header className="cg-head">
        <div>
          <h2>{city.name}</h2>
          <p className="cg-region"><MapPin size={14} />{g.region}</p>
        </div>
        <div className="cg-known">{g.knownFor.map((k) => <span key={k}>{k}</span>)}</div>
      </header>

      <div className="cg-tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      <div className="cg-panel" role="tabpanel">
        {tab === 'overview' && (
          <>
            <div className="cg-facts">
              {g.facts.map(([k, v], i) => (
                <div key={k}><span className="cg-ico">{FACT_ICON[i]}</span><small>{k}</small><b>{v}</b></div>
              ))}
            </div>
            <div className="cg-months" aria-label="Best months to visit">
              <small>Best months</small>
              <ol>
                {g.months.map((m, i) => <li key={i} className={m + (i === 10 ? ' now' : '')} title={m}>{MONTHS[i]}</li>)}
              </ol>
              <span className="cg-legend"><i className="best" />Best <i className="ok" />Okay <i className="avoid" />Monsoon or hot</span>
            </div>
            <ul className="cg-tips">
              {g.tips.map((t) => <li key={t}><Lightbulb size={15} weight="fill" />{t}</li>)}
            </ul>
          </>
        )}
        {tab === 'reach' && (
          <div className="cg-list">
            {g.reach.map(([mode, k, v, sub]) => (
              <div key={k} className="cg-row"><span className="cg-ico">{REACH_ICON[mode]}</span><div><small>{k}</small><b>{v}</b><span>{sub}</span></div></div>
            ))}
          </div>
        )}
        {tab === 'todo' && (
          <ol className="cg-todo">
            {g.todo.map(([name, kind, where], i) => (
              <li key={name}><em>{i + 1}</em><div><b>{name}</b><span>{kind} · {where}</span></div></li>
            ))}
          </ol>
        )}
        {tab === 'stay' && (
          <div className="cg-list">
            {g.stay.map(([area, why]) => (
              <div key={area} className="cg-row"><span className="cg-ico"><Bed size={20} /></span><div><b>{area}</b><span>{why}</span></div></div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
