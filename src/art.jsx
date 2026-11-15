// Illustrated stand-ins for photos. Each scene is a small SVG, so the prototype has no image files.
import { useId, useState } from 'react'
import { PHOTOS } from './photos.js'

const PALETTES = {
  beach: ['#FFB36B', '#FFD9A0', '#2BA6C9', '#F3DDB0'],
  cliff: ['#7FC4E8', '#CDEBF7', '#1F7FA6', '#8A6A4A'],
  heritage: ['#F7C873', '#FCE7B8', '#3C8FB5', '#E8B07A'],
  hills: ['#8EC5E8', '#DDF0FA', '#4E8A5B', '#2F6B45'],
  party: ['#2A1B5C', '#5A2C8C', '#D2407B', '#FFB36B'],
  quiet: ['#B8D9C6', '#EAF5EE', '#5FA27A', '#3A7255'],
  villa: ['#8FD3F5', '#E3F5FD', '#29A8D8', '#F2E3C6'],
  hostel: ['#FFC78A', '#FFEBD1', '#3BA0C7', '#E9C99B'],
  resort: ['#FF9E7A', '#FFD3B8', '#2C8FB8', '#F0D7AE'],
  homestay: ['#A8D8B0', '#E6F4E8', '#4F9A63', '#D9B98C'],
}

export function Scene({ kind = 'beach', className = '', label }) {
  const [failed, setFailed] = useState(false)
  const photo = PHOTOS[kind]
  if (photo && !failed) {
    return <img className={'scene photo ' + className} src={photo.src} alt={label || photo.title} loading="lazy" decoding="async" onError={() => setFailed(true)} />
  }
  return <Illustration kind={kind === 'goa' ? 'beach' : kind === 'gokarna' ? 'cliff' : kind === 'pondy' ? 'heritage' : kind} className={className} label={label} />
}

function Illustration({ kind, className, label }) {
  const uid = useId().replace(/:/g, '')
  const [sky1, sky2, sea, land] = PALETTES[kind] || PALETTES.beach
  const night = kind === 'party'
  return (
    <svg className={'scene ' + className} viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label || kind}>
      <defs>
        <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky1} />
          <stop offset="1" stopColor={sky2} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#sky${uid})`} />
      {night ? (
        <g fill="#fff" opacity=".8">
          {[[40, 30], [90, 60], [150, 25], [220, 50], [300, 30], [360, 70], [260, 90]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 2 ? 1.6 : 2.4} />)}
          <circle cx="330" cy="50" r="18" fill="#FFE9B5" />
        </g>
      ) : (
        <circle cx="300" cy="80" r="30" fill="#FFF3D6" opacity=".9" />
      )}
      {(kind === 'hills' || kind === 'quiet' || kind === 'homestay') && (
        <>
          <path d="M0 170 L80 90 L150 150 L230 70 L320 150 L400 100 L400 260 L0 260Z" fill={land} opacity=".55" />
          <path d="M0 200 L90 140 L170 190 L260 130 L400 190 L400 260 L0 260Z" fill={sea} />
        </>
      )}
      {(kind === 'beach' || kind === 'villa' || kind === 'hostel' || kind === 'resort' || kind === 'cliff') && (
        <>
          <path d="M0 165 Q100 155 200 165 T400 162 L400 260 L0 260Z" fill={sea} />
          <path d="M0 180 Q100 172 200 182 T400 178" stroke="#fff" strokeOpacity=".5" strokeWidth="3" fill="none" />
          <path d="M0 215 Q120 190 260 205 T400 200 L400 260 L0 260Z" fill={land} />
        </>
      )}
      {kind === 'cliff' && <path d="M250 260 L270 140 L330 120 L400 130 L400 260Z" fill="#6B5139" />}
      {(kind === 'beach' || kind === 'hostel' || kind === 'cliff') && <Palm x={70} y={215} />}
      {kind === 'beach' && <Palm x={110} y={222} s={0.75} />}
      {kind === 'villa' && (
        <g>
          <rect x="150" y="120" width="170" height="85" fill="#fff" />
          <path d="M140 122 L235 80 L330 122Z" fill="#E8705A" />
          <rect x="170" y="140" width="28" height="30" fill="#8FD3F5" />
          <rect x="215" y="140" width="28" height="30" fill="#8FD3F5" />
          <rect x="262" y="140" width="40" height="65" fill="#C98A5A" />
          <rect x="60" y="215" width="230" height="30" rx="6" fill="#4CC3EE" />
          <Palm x={60} y={210} s={0.8} />
        </g>
      )}
      {kind === 'hostel' && (
        <g>
          <rect x="190" y="130" width="140" height="75" fill="#FFF7EC" />
          <rect x="190" y="118" width="140" height="14" fill="#3BA0C7" />
          {[205, 240, 275, 305].map((x) => <rect key={x} x={x} y="145" width="18" height="18" fill="#FFC78A" />)}
          <rect x="250" y="175" width="22" height="30" fill="#8A6A4A" />
        </g>
      )}
      {kind === 'resort' && (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={120 + i * 80} y={135 - i * 10} width="60" height={70 + i * 10} fill="#fff" />
              <rect x={128 + i * 80} y={150 - i * 10} width="44" height="10" fill="#2C8FB8" opacity=".7" />
              <rect x={128 + i * 80} y={170 - i * 10} width="44" height="10" fill="#2C8FB8" opacity=".7" />
            </g>
          ))}
          <Palm x={340} y={215} s={0.9} />
        </g>
      )}
      {kind === 'homestay' && (
        <g>
          <rect x="140" y="160" width="120" height="60" fill="#FFF7EC" />
          <path d="M130 162 L200 120 L270 162Z" fill="#B5543C" />
          <rect x="190" y="185" width="20" height="35" fill="#8A6A4A" />
          <circle cx="320" cy="170" r="34" fill="#3A7255" />
          <rect x="316" y="190" width="8" height="35" fill="#6B5139" />
        </g>
      )}
      {kind === 'heritage' && (
        <g>
          <path d="M0 200 L400 200 L400 260 L0 260Z" fill={land} />
          {[40, 140, 240].map((x, i) => (
            <g key={x}>
              <rect x={x} y={110 + i * 6} width="90" height={90 - i * 6} fill={['#F6D27A', '#F2A65A', '#9FD3C7'][i]} />
              {[0, 1, 2].map((j) => <rect key={j} x={x + 10 + j * 27} y={128 + i * 6} width="16" height="26" rx="8" fill="#fff" opacity=".85" />)}
            </g>
          ))}
          <rect x="0" y="198" width="400" height="6" fill="#fff" opacity=".6" />
        </g>
      )}
      {kind === 'hills' && <path d="M200 70 L230 70 L215 50Z" fill="#fff" />}
      {kind === 'party' && (
        <g>
          <path d="M0 200 L400 200 L400 260 L0 260Z" fill="#160E33" />
          {[60, 130, 200, 270, 340].map((x, i) => <rect key={x} x={x} y={150 - (i % 3) * 20} width="40" height={50 + (i % 3) * 20} fill="#2A1B5C" />)}
          {[80, 170, 250, 330].map((x, i) => <path key={x} d={`M${x} 200 L${x - 40 + i * 10} 60`} stroke={['#FFB36B', '#D2407B', '#59BAFF', '#FFE9B5'][i]} strokeWidth="6" opacity=".55" />)}
        </g>
      )}
      {kind === 'quiet' && <path d="M60 230 q30 -20 60 0 q30 -20 60 0" stroke="#fff" strokeWidth="3" fill="none" opacity=".7" />}
    </svg>
  )
}

function Palm({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 Q6 -50 18 -95" stroke="#7A5638" strokeWidth="7" fill="none" strokeLinecap="round" />
      <g fill="#2F8F5B">
        <path d="M18 -95 Q-15 -110 -40 -85 Q-10 -95 18 -95Z" />
        <path d="M18 -95 Q50 -115 75 -88 Q45 -98 18 -95Z" />
        <path d="M18 -95 Q0 -130 -20 -125 Q5 -110 18 -95Z" />
        <path d="M18 -95 Q40 -135 60 -122 Q35 -112 18 -95Z" />
      </g>
    </g>
  )
}

// Product icons: masked from a screenshot of MakeMyTrip's own icon row (public/brand/icons).
const ICONS = ['flight', 'hotel', 'villa', 'holiday', 'train', 'bus', 'cab', 'tours', 'visa', 'forex', 'insurance']
export function Icon({ name, size = 40 }) {
  const n = ICONS.includes(name) ? name : 'tours'
  return <img className="mmt-ico" src={'/brand/icons/' + n + '.png'} width={size} height={size} alt="" aria-hidden="true" draggable="false" />
}

// Myra's orb: a pearly, iridescent bubble that breathes and slowly changes shape.
// States: idle, think (quicker), listen (bigger breaths, like a voice).
export function MyraOrb({ size = 36, pulse = false, state }) {
  const st = state || (pulse ? 'think' : 'idle')
  return (
    <span className={'orb orb-' + st + (size < 40 ? ' orb-sm' : '')} style={{ '--s': size + 'px' }} aria-hidden="true">
      <i className="orb-rim" />
      <i className="orb-rim two" />
      <i className="orb-pearl" />
      <i className="orb-gloss" />
    </span>
  )
}

// Myra wordmark: script lettering in Myra's navy-to-blue, with its sparkle.
export function MyraMark({ size = 22 }) {
  return (
    <span className="myra-mark" style={{ fontSize: size }}>
      myra
      <svg className="sparkle" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c1 6 5 10.5 12 12-7 1.5-11 6-12 12-1-6-5-10.5-12-12C7 10.5 11 6 12 0z" /></svg>
    </span>
  )
}

export function Logo() {
  return (
    <span className="mmt-logo">
      <img src="/brand/mmt-logo.svg" alt="makemytrip" width="94" height="30" />
    </span>
  )
}

export function ModeIcon({ mode }) {
  return <Icon name={mode === 'flight' ? 'flight' : mode === 'bus' ? 'bus' : 'train'} size={44} />
}
