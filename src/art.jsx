// Illustrated stand-ins for photos. Each scene is a small SVG, so the prototype has no image files.
import { useId } from 'react'

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

// MakeMyTrip-style product icons: blue and white, slightly 3D.
export function Icon({ name, size = 40 }) {
  const b = '#008CFF', d = '#1A3E6B', l = '#CFE8FF'
  const common = { width: size, height: size, viewBox: '0 0 48 48', 'aria-hidden': true }
  switch (name) {
    case 'flight':
      return (<svg {...common}><path d="M6 30 L40 14 q5 -2 4 2 L14 34Z" fill={l} stroke={d} strokeWidth="1.6" strokeLinejoin="round" /><path d="M22 24 L28 36 L32 34 L28 21Z" fill={b} stroke={d} strokeWidth="1.4" /><path d="M16 27 L12 20 L15 19 L21 25Z" fill={b} stroke={d} strokeWidth="1.2" /></svg>)
    case 'hotel':
      return (<svg {...common}><rect x="10" y="10" width="18" height="30" fill="#fff" stroke={d} strokeWidth="1.6" /><rect x="28" y="18" width="10" height="22" fill={b} stroke={d} strokeWidth="1.6" />{[14, 19, 24].map(y => [13, 19].map(x => <rect key={x + '-' + y} x={x} y={y} width="4" height="3" fill={d} />))}<rect x="16" y="32" width="6" height="8" fill={d} /></svg>)
    case 'villa':
      return (<svg {...common}><path d="M8 24 L22 12 L36 24" fill="none" stroke={d} strokeWidth="1.8" strokeLinejoin="round" /><rect x="11" y="23" width="22" height="16" fill="#fff" stroke={d} strokeWidth="1.6" /><rect x="30" y="28" width="10" height="11" fill={b} stroke={d} strokeWidth="1.4" /><rect x="18" y="30" width="6" height="9" fill={b} /></svg>)
    case 'holiday':
      return (<svg {...common}><path d="M8 20 Q24 4 40 20Z" fill={b} stroke={d} strokeWidth="1.6" /><path d="M24 12 L24 40" stroke={d} strokeWidth="1.8" /><circle cx="15" cy="38" r="4" fill={l} stroke={d} strokeWidth="1.4" /></svg>)
    case 'train':
      return (<svg {...common}><path d="M6 32 L30 14 q8 -4 12 2 L20 34Z" fill="#fff" stroke={d} strokeWidth="1.6" strokeLinejoin="round" /><path d="M10 31 L32 16 L36 18 L14 33Z" fill={b} /><path d="M6 38 L42 22" stroke={d} strokeWidth="1.4" /></svg>)
    case 'bus':
      return (<svg {...common}><rect x="8" y="14" width="32" height="20" rx="4" fill="#fff" stroke={d} strokeWidth="1.6" /><rect x="11" y="17" width="26" height="7" fill={b} /><circle cx="15" cy="36" r="3" fill={d} /><circle cx="33" cy="36" r="3" fill={d} /></svg>)
    case 'cab':
      return (<svg {...common}><path d="M8 30 L12 20 q2 -4 6 -4 h12 q4 0 6 4 L40 30 v6 H8Z" fill="#fff" stroke={d} strokeWidth="1.6" /><path d="M14 22 h20 l2 6 H12Z" fill={b} /><circle cx="15" cy="36" r="3" fill={d} /><circle cx="33" cy="36" r="3" fill={d} /></svg>)
    case 'tours':
      return (<svg {...common}><ellipse cx="24" cy="18" rx="10" ry="12" fill={l} stroke={d} strokeWidth="1.6" /><path d="M24 6 v24 M14 18 h20" stroke={b} strokeWidth="1.4" /><rect x="20" y="34" width="8" height="6" fill={b} stroke={d} strokeWidth="1.2" /></svg>)
    case 'visa':
      return (<svg {...common}><rect x="13" y="8" width="22" height="32" rx="2" fill={l} stroke={d} strokeWidth="1.6" /><circle cx="24" cy="22" r="6" fill="none" stroke={b} strokeWidth="1.6" /></svg>)
    case 'forex':
      return (<svg {...common}><rect x="8" y="14" width="32" height="20" rx="3" fill={l} stroke={d} strokeWidth="1.6" transform="rotate(-10 24 24)" /><text x="20" y="30" fontSize="12" fontWeight="900" fill={b}>$</text></svg>)
    case 'insurance':
      return (<svg {...common}><path d="M24 6 L38 12 v10 q0 12 -14 18 q-14 -6 -14 -18 V12Z" fill={l} stroke={d} strokeWidth="1.6" /><path d="M18 24 l4 4 l8 -8" stroke={b} strokeWidth="2.4" fill="none" /></svg>)
    default:
      return null
  }
}

export function MyraOrb({ size = 36, pulse = false }) {
  return <span className={'myra-orb' + (pulse ? ' pulse' : '')} style={{ width: size, height: size }} aria-hidden="true" />
}

export function Logo({ dark = false }) {
  return (
    <span className={'mmt-logo' + (dark ? ' dark' : '')} aria-label="makemytrip">
      <span>make</span><b>my</b><span>trip</span>
    </span>
  )
}

export function ModeIcon({ mode }) {
  return <Icon name={mode === 'flight' ? 'flight' : mode === 'bus' ? 'bus' : 'train'} size={44} />
}
