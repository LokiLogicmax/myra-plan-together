// Destination guide per city, in the shape of a Where2Go page: overview, how to reach,
// things to do, best months, where to stay, tips. Sample data for the prototype.
// Month ratings: 'best' | 'ok' | 'avoid', Jan → Dec.
export const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

export const CITY_GUIDE = {
  goa: {
    region: 'Goa · West coast',
    knownFor: ['Beaches', 'Nightlife', 'Portuguese heritage', 'Seafood'],
    facts: [
      ['Best time', 'Nov – Feb'],
      ['Ideal for', '3 – 5 days'],
      ['In Nov', '24–32°C, dry'],
      ['Language', 'Konkani, English'],
    ],
    reach: [
      ['flight', 'By air', 'Dabolim (GOI) or Mopa (GOX)', '1h 10m from Bengaluru'],
      ['train', 'By train', 'Madgaon (MAO) · Thivim (THVM)', '12h overnight from SBC'],
      ['road', 'By road', '560 km via NH48', 'About 10h drive'],
    ],
    todo: [
      ['Anjuna & Vagator beaches', 'Beach', 'North Goa'],
      ['Basilica of Bom Jesus', 'Heritage · UNESCO', 'Old Goa'],
      ['Saturday night market', 'Shopping', 'Arpora'],
      ['Chapora Fort at sunset', 'Viewpoint', 'Vagator'],
      ['Dudhsagar Falls', 'Nature', '60 km inland'],
      ['Fontainhas walk', 'Heritage', 'Panjim'],
    ],
    months: ['best', 'best', 'ok', 'ok', 'ok', 'avoid', 'avoid', 'avoid', 'avoid', 'ok', 'best', 'best'],
    stay: [
      ['North Goa', 'Baga, Anjuna. Lively, cafés and clubs'],
      ['South Goa', 'Palolem, Colva. Calm, cleaner beaches'],
      ['Panjim', 'Old Latin Quarter. Central, heritage stays'],
    ],
    tips: [
      'Rent a scooter (about ₹400 a day). Carry your licence.',
      'Taxis are pricey; book through the GoaMiles app.',
      'Prices jump in the last week of December.',
    ],
  },
  gokarna: {
    region: 'Karnataka · Coastal temple town',
    knownFor: ['Quiet beaches', 'Beach treks', 'Temple town', 'Cafés'],
    facts: [
      ['Best time', 'Oct – Mar'],
      ['Ideal for', '2 – 3 days'],
      ['In Nov', '23–31°C, dry'],
      ['Language', 'Kannada, Konkani'],
    ],
    reach: [
      ['flight', 'By air', 'Goa Dabolim (GOI), 140 km', 'Then 3h by road'],
      ['train', 'By train', 'Gokarna Road (GOK), 10 km', 'Few trains from Bengaluru'],
      ['road', 'By road', '480 km from Bengaluru', 'About 9h; overnight buses'],
    ],
    todo: [
      ['Om Beach', 'Beach', 'Shaped like the Om symbol'],
      ['Kudle to Paradise trek', 'Trek', '7 km, beach to beach'],
      ['Half Moon Beach', 'Beach', 'Reach on foot or by boat'],
      ['Mahabaleshwar Temple', 'Temple', 'Town centre'],
      ['Sunset at Kudle', 'Viewpoint', 'Cliff cafés'],
    ],
    months: ['best', 'best', 'best', 'ok', 'ok', 'avoid', 'avoid', 'avoid', 'avoid', 'best', 'best', 'best'],
    stay: [
      ['Kudle Beach', 'Cafés and guesthouses on the sand'],
      ['Om Beach', 'Huts and small resorts, quieter'],
      ['Town', 'Cheapest, near the temple'],
    ],
    tips: [
      'Start the beach trek early; there’s little shade.',
      'Few ATMs. Carry cash.',
      'Dress modestly in town and at the temple.',
    ],
  },
  pondy: {
    region: 'Puducherry · East coast',
    knownFor: ['French Quarter', 'Cafés & food', 'Auroville', 'Promenade'],
    facts: [
      ['Best time', 'Jan – Mar'],
      ['Ideal for', '2 – 3 days'],
      ['In Nov', '24–29°C, some rain'],
      ['Language', 'Tamil, English, French'],
    ],
    reach: [
      ['flight', 'By air', 'Chennai (MAA), 150 km', 'Then 3h by road'],
      ['train', 'By train', 'Puducherry (PDY) · Villupuram (VM)', 'Change at Villupuram'],
      ['road', 'By road', '310 km from Bengaluru', 'About 6h 30m drive'],
    ],
    todo: [
      ['French Quarter walk', 'Heritage', 'White Town'],
      ['Auroville & Matrimandir', 'Culture', '12 km north'],
      ['Promenade at dawn', 'Seafront', 'Rock Beach'],
      ['Paradise Beach', 'Beach', 'Boat from Chunnambar'],
      ['Sri Aurobindo Ashram', 'Spiritual', 'White Town'],
    ],
    months: ['best', 'best', 'best', 'ok', 'avoid', 'ok', 'ok', 'ok', 'ok', 'ok', 'avoid', 'ok'],
    stay: [
      ['White Town', 'French villas, walk everywhere'],
      ['Auroville', 'Quiet, green, eco stays'],
      ['ECR beach side', 'Resorts by the sea'],
    ],
    tips: [
      'Rent a cycle to get around White Town.',
      'Book the Matrimandir inner chamber in advance.',
      'Late November can be rainy; keep a day free.',
    ],
  },
}
