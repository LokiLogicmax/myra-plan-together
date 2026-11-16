// Sample data for the concept prototype. Prices, seats and reviews are made up.

export const HOST = { id: 'host', name: 'Anurag', short: 'A', color: '#008CFF' }

export const FRIENDS = [
  { id: 'riya', name: 'Riya', color: '#E8705A' },
  { id: 'kabir', name: 'Kabir', color: '#2BA672' },
  { id: 'meera', name: 'Meera', color: '#834CC5' },
  { id: 'dev', name: 'Dev', color: '#E2A23B' },
  { id: 'sana', name: 'Sana', color: '#D2407B' },
]

// The friend who opens the link in the demo
export const DEMO_FRIEND = 'meera'

export const EXPERIENCES = [
  { id: 'beach', label: 'Beaches & chill', sub: 'Sun, sea, slow days', art: 'beach' },
  { id: 'hills', label: 'Mountains & treks', sub: 'Cool air, long walks', art: 'hills' },
  { id: 'party', label: 'Nightlife', sub: 'Clubs, live music', art: 'party' },
  { id: 'quiet', label: 'Quiet escape', sub: 'Nature, no crowds', art: 'quiet' },
  { id: 'romantic', label: 'Romantic getaway', sub: 'Lakes, sunsets, slow dinners', art: 'romantic' },
  { id: 'adventure', label: 'Adventure', sub: 'Rafting, camps, treks', art: 'adventure' },
]

export const PEOPLE = ['1', '2', '3–4', '5–6', '7–8', '9+']
// Who's coming → how Myra plans. Solo and couple trips skip the group vote.
export const PARTY = {
  '1': { mode: 'solo', label: 'Just me', big: '1', unit: 'person', sub: 'Solo trip' },
  '2': { mode: 'couple', label: '2 people', big: '2', unit: 'people', sub: 'Couple or two friends' },
  '3–4': { mode: 'group', label: '3–4 people', big: '3–4', unit: 'people', sub: 'Small group · friends vote' },
  '5–6': { mode: 'group', label: '5–6 people', big: '5–6', unit: 'people', sub: 'Group · friends vote' },
  '7–8': { mode: 'group', label: '7–8 people', big: '7–8', unit: 'people', sub: 'Group · friends vote' },
  '9+': { mode: 'group', label: '9+ people', big: '9+', unit: 'people', sub: 'Big group · friends vote' },
}
export const FROM = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad']
// Airport and station codes for each starting city.
export const CODES = { Bengaluru: 'BLR airport · SBC station', Mumbai: 'BOM airport · CSMT station', Delhi: 'DEL airport · NDLS station', Hyderabad: 'HYD airport · SC station' }

// Budget per person for the whole trip (travel + stay).
export const BUDGET = [
  { id: 'b1', label: 'Under ₹5,000', big: '<₹5k', max: 5000, sub: 'Hostels, buses, beach shacks' },
  { id: 'b2', label: '₹5,000 – ₹10,000', big: '₹5–10k', max: 10000, sub: 'Trains, shared villas' },
  { id: 'b3', label: '₹10,000 – ₹20,000', big: '₹10–20k', max: 20000, sub: 'Flights, resorts' },
  { id: 'b4', label: '₹20,000+', big: '₹20k+', max: Infinity, sub: 'Boutique stays' },
  { id: 'bf', label: 'Flexible', big: 'Flexible', max: Infinity, sub: 'Show me everything' },
]
// Who the stay and rooms should suit.
export const GENDER = [
  { id: 'any', label: 'No preference', big: 'Any', sub: 'Any stay, any room' },
  { id: 'women', label: 'Women only', big: 'Women', sub: 'Women-friendly stays, female dorms' },
  { id: 'men', label: 'Men only', big: 'Men', sub: 'Men-only dorms where offered' },
  { id: 'mixed', label: 'Mixed group', big: 'Mixed', sub: 'Separate rooms for men and women' },
]

export const WHEN = [
  { id: 'w1', label: 'This weekend', sub: 'Fri 20 – Sun 22 Nov' },
  { id: 'w2', label: 'Next weekend', sub: 'Fri 27 – Sun 29 Nov' },
  { id: 'w3', label: 'Pick dates', sub: 'Choose on a calendar' },
]

export const CITIES = [
  {
    id: 'goa', name: 'Goa', art: 'goa', pick: true,
    tag: 'In season',
    weather: '24–32°C, dry and sunny',
    reach: 'Overnight train · 1h 10m flight',
    todo: ['Anjuna & Vagator beaches', 'Saturday night market', 'Sunset at Chapora Fort'],
    est: '₹6,500 – ₹9,500',
    why: 'Late November is the start of the season, and you can go by overnight train, so nobody spends Friday travelling.',
  },
  {
    id: 'gokarna', name: 'Gokarna', art: 'gokarna',
    tag: 'Quieter',
    weather: '23–31°C, dry',
    reach: 'Overnight bus · 9h',
    todo: ['Om & Half Moon beaches', 'Beach trek', 'Cafés on Kudle'],
    est: '₹4,500 – ₹6,500',
    why: 'Cheaper and calmer than Goa, but fewer places to eat and no direct trains.',
  },
  {
    id: 'pondy', name: 'Puducherry', art: 'pondy',
    tag: 'Best for food',
    weather: '24–29°C, some rain',
    reach: 'Road trip · 6h 30m',
    todo: ['French Quarter walks', 'Auroville', 'Paradise Beach'],
    est: '₹5,000 – ₹7,500',
    why: 'Good for a road trip, but late November can still be rainy on that coast.',
  },
]

// Prices are per person, return trip.
export const TRANSPORT = [
  {
    id: 't1', mode: 'train', title: 'Overnight train · 3AC', route: 'Bengaluru (SBC) → Madgaon (MAO)',
    dep: 'Thu 26 · 9:15 pm', arr: 'Fri 27 · 9:40 am', dur: '12h 25m', price: 2360,
    seats: '6 berths in one coach', pick: true,
    why: 'Cheapest, and you sleep on the way, so you arrive Friday morning without paying for an extra night.',
    back: 'Back Sun 29 · 8:40 pm → Mon 30 · 9:05 am',
  },
  {
    id: 't2', mode: 'flight', title: 'Flight · to Dabolim (GOI)', route: 'Bengaluru (BLR) → Goa Dabolim (GOI)',
    dep: 'Fri 27 · 6:10 am', arr: 'Fri 27 · 7:20 am', dur: '1h 10m', price: 9300,
    seats: '6 seats at this fare',
    back: 'Back Sun 29 · 9:30 pm → 10:40 pm',
  },
  {
    id: 't3', mode: 'flight', title: 'Flight · to Mopa (GOX)', route: 'Bengaluru (BLR) → North Goa Mopa (GOX)',
    dep: 'Fri 27 · 7:45 am', arr: 'Fri 27 · 8:55 am', dur: '1h 10m', price: 7960,
    seats: '6 seats at this fare',
    warn: 'Lands at Mopa in North Goa. About 45 min to Anjuna, but 2 h to South Goa.',
    back: 'Back Sun 29 · 8:15 pm → 9:25 pm',
  },
  {
    id: 't4', mode: 'bus', title: 'AC sleeper bus', route: 'Bengaluru (Madiwala) → Mapusa',
    dep: 'Thu 26 · 8:30 pm', arr: 'Fri 27 · 8:00 am', dur: '11h 30m', price: 2900,
    seats: 'Only 2 berths left', soldOut: true, altId: 't5',
    back: 'Back Sun 29 · 9:00 pm → Mon 30 · 8:30 am',
  },
]

export const TRANSPORT_ALT = {
  id: 't5', mode: 'bus', title: 'AC sleeper bus · later', route: 'Bengaluru (Madiwala) → Mapusa',
  dep: 'Thu 26 · 9:30 pm', arr: 'Fri 27 · 9:15 am', dur: '11h 45m', price: 3300,
  seats: '6 berths available',
  back: 'Back Sun 29 · 9:30 pm → Mon 30 · 9:15 am',
}

// pricing: 'flat' = whole property per night, 'pp' = per person per night
export const STAYS = [
  {
    id: 's1', name: 'Casa Azul Villa', area: 'Assagao', art: 'villa', pick: true,
    type: 'Private villa · 3 bedrooms', pricing: 'flat', rate: 12900,
    rating: 4.6, reviews: 812, beach: '1.8 km to Anjuna Beach',
    amen: ['Private pool', 'Kitchen', 'Wi-Fi', 'AC', 'Parking'],
    why: 'Sleeps 6 in 3 rooms, has a pool, and costs less per person than booking 3 hotel rooms.',
    review: '“Perfect for our group of 6. The caretaker cooked a Goan breakfast for us.”',
    map: { x: 58, y: 40 },
    unit: 'villa', sleeps: 6, left: [1, 1],
  },
  {
    id: 's2', name: 'Lazy Gecko Hostel', area: 'Anjuna', art: 'hostel',
    type: 'Private 6-bed room', solo: 'Bed in a 6-bed room', couple: '2 beds in a 6-bed room', pricing: 'pp', rate: 950,
    rating: 4.4, reviews: 1204, beach: '400 m to Anjuna Beach',
    amen: ['Café', 'Wi-Fi', 'Lockers', 'Common area'],
    review: '“Social, clean and right by the beach. Thin walls though.”',
    map: { x: 30, y: 52 },
    unit: 'bed', sleeps: 1, left: [9, 7],
  },
  {
    id: 's3', name: 'Sunset Bay Resort', area: 'Vagator', art: 'resort',
    type: '3 deluxe rooms', solo: '1 deluxe room', couple: '1 deluxe room for 2', pricing: 'pp', rate: 3400,
    rating: 4.3, reviews: 2310, beach: 'On Vagator Beach',
    amen: ['Shared pool', 'Spa', 'Restaurant', 'Breakfast'],
    review: '“Amazing sunsets from the room. The restaurant is pricey.”',
    map: { x: 22, y: 28 },
    unit: 'room', sleeps: 2, left: [4, 3],
  },
  {
    id: 's4', name: 'Fig Tree Homestay', area: 'Assagao', art: 'homestay',
    type: 'Whole house · 3 rooms', pricing: 'flat', rate: 9600,
    rating: 4.7, reviews: 210, beach: '3.5 km to Anjuna Beach',
    amen: ['Garden', 'Kitchen', 'Wi-Fi', 'Home-cooked meals'],
    review: '“Quiet, green and the host is lovely. You’ll need scooters.”',
    map: { x: 72, y: 62 },
    unit: 'house', sleeps: 6, left: [1, 1],
  },
  {
    id: 's5', name: 'Palolem Beach Huts', area: 'Palolem', art: 'goa',
    type: '3 beach huts', solo: '1 beach hut', couple: '1 beach hut for 2', pricing: 'pp', rate: 1600,
    rating: 4.2, reviews: 980, beach: 'On Palolem Beach, South Goa',
    amen: ['Sea view', 'Beach café', 'Hammocks', 'Fan'],
    review: '“Waking up to the sea is worth it. Basic, but clean.”',
    map: { x: 80, y: 86 },
    unit: 'hut', sleeps: 2, left: [2, 2],
  },
  {
    id: 's6', name: 'Fontainhas Heritage Home', area: 'Panjim', art: 'fontainhas',
    type: 'Portuguese house · 3 rooms', pricing: 'flat', rate: 10800,
    rating: 4.5, reviews: 342, beach: '20 min to Miramar Beach',
    amen: ['Heritage house', 'Breakfast', 'Wi-Fi', 'AC', 'Walk to cafés'],
    review: '“Like living in an old Goan home. Great food all around.”',
    map: { x: 66, y: 76 },
    unit: 'house', sleeps: 6, left: [1, 1],
  },
  {
    id: 's7', name: 'Lagoon Cottages', area: 'Cola, South Goa', art: 'cola',
    type: '3 cottages', solo: '1 cottage', couple: '1 cottage for 2', pricing: 'pp', rate: 2600,
    rating: 4.6, reviews: 455, beach: 'Lagoon and beach, 2h from Anjuna',
    amen: ['Lagoon', 'Kayaks', 'Restaurant', 'Breakfast'],
    review: '“So peaceful. Far from everything, which is the point.”',
    map: { x: 88, y: 70 },
    unit: 'cottage', sleeps: 2, left: [3, 0],
  },
  {
    id: 's8', name: 'Anjuna Shack Rooms', area: 'Anjuna', art: 'beach',
    type: '3 sea-facing rooms', solo: '1 sea-facing room', couple: '1 sea-facing room for 2', pricing: 'pp', rate: 2100,
    rating: 4.1, reviews: 1630, beach: 'On Anjuna Beach',
    amen: ['Sea view', 'Beach shack', 'Music nights'],
    review: '“Right on the sand. Loud on weekends.”',
    map: { x: 36, y: 44 },
    unit: 'room', sleeps: 2, left: [0, 0], nextFree: '4–6 Dec',
  },
]

// Availability on the decided dates (Fri 27 and Sat 28 Nov) for who's going.
export const NIGHT_LABELS = ['Fri 27', 'Sat 28']
export function stayAvail(x, people) {
  const need = Math.ceil(people / x.sleeps)
  const nights = x.left.map((l) => l >= need)
  const units = (n) => n + ' ' + x.unit + (n === 1 ? '' : 's')
  const min = Math.min(...x.left)
  if (x.left.every((l) => l === 0)) return { ok: false, nights, kind: 'sold', text: 'Sold out on 27–29 Nov', sub: x.nextFree ? 'Free again ' + x.nextFree : '' }
  if (nights.every(Boolean)) {
    if (x.pricing === 'flat') return { ok: true, nights, kind: 'free', text: 'Free both nights', sub: 'Whole ' + x.unit + ', just for you' }
    const few = min - need <= 1
    return { ok: true, nights, kind: few ? 'few' : 'free', text: few ? 'Only ' + units(min) + ' left' : 'Free both nights', sub: few ? 'you need ' + need : units(min) + ' left' }
  }
  if (nights.some(Boolean)) return { ok: false, nights, kind: 'part', text: NIGHT_LABELS[nights.indexOf(false)] + ' is full', sub: 'Free only one of 2 nights' }
  return { ok: false, nights, kind: 'short', text: 'Only ' + units(min) + ' left', sub: `Not enough for ${people}` }
}

// Room description for who's going.
export const stayType = (x, mode, gender) => {
  if (x.id === 's2' && mode !== 'group' && gender === 'women') return mode === 'solo' ? 'Bed in a female-only dorm' : '2 beds in a female-only dorm'
  if (x.id === 's2' && mode !== 'group' && gender === 'men') return mode === 'solo' ? 'Bed in a male-only dorm' : '2 beds in a male-only dorm'
  return (mode !== 'group' && x[mode]) || x.type
}

export const NIGHTS = 2

export function stayPerPerson(stay, people) {
  if (!stay) return 0
  return stay.pricing === 'flat' ? Math.round((stay.rate * NIGHTS) / people) : stay.rate * NIGHTS
}

export function stayTotal(stay, people) {
  if (!stay) return 0
  return stay.pricing === 'flat' ? stay.rate * NIGHTS : stay.rate * NIGHTS * people
}

export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

// Votes already in when the link is opened (everyone except the demo friend).
// Each preference list is tried in order against the host's shortlist.
export const PRESET_VOTES = {
  transport: { riya: ['t2', 't3', 't1'], kabir: ['t1'], dev: ['t1'], sana: ['t1'] },
  stay: { riya: ['s1', 's3'], sana: ['s1', 's3'], kabir: ['s4', 's2'], dev: ['s4', 's2'] },
}

export const PRESET_COMMENTS = {
  transport: [
    { who: 'dev', text: 'Train works for me, I can sleep on it.' },
    { who: 'riya', text: 'The flight saves a whole night though ✈️' },
  ],
  stay: [
    { who: 'kabir', text: 'The homestay looks calmer, and it’s cheaper.' },
    { who: 'sana', text: 'Pool. Please. 🙏' },
  ],
}

export const HOST_STEPS = [
  'Trip basics', 'City', 'Transport', 'Stay', 'Share with friends', 'Friends vote', 'Review & book',
]
export const DUO_STEPS = ['Trip basics', 'City', 'Transport', 'Stay', 'Review & book']
// Myra's stay pick depends on who's going.
export const STAY_PICK = { solo: 's2', couple: 's3', group: 's1' }
export const STAY_WHY = {
  solo: 'Lazy Gecko is my pick for one: 400 m from Anjuna Beach, social if you want company, and the cheapest bed here.',
  couple: 'Sunset Bay is my pick for two: a deluxe room right on Vagator Beach, breakfast included, and sunsets from the room.',
}
export const FRIEND_STEPS = ['Transport', 'Stay', 'Send your picks']
