(function () {
  'use strict';

  var CORE_CATEGORIES = ['dining', 'travel', 'groceries', 'gas', 'streaming', 'onlineShopping', 'other'];

  function makeEarnRates(rates, extras) {
    var result = {};
    CORE_CATEGORIES.forEach(function (key) {
      result[key] = rates && rates[key] != null ? Number(rates[key]) : 1;
    });
    if (extras && typeof extras === 'object') {
      Object.keys(extras).forEach(function (key) {
        result[key] = Number(extras[key]);
      });
    }
    return result;
  }

  function makeCard(name, annualFee, rates, extras) {
    return {
      name: name,
      annualFee: annualFee,
      earnRates: makeEarnRates(rates, extras)
    };
  }

  var PROGRAMS = {
    lastUpdated: '2026-03-17',
    programs: {
      'Chase Ultimate Rewards': {
        slug: 'chase-ur',
        type: 'flexible',
        currency: 'points',
        cpp: 2.0,
        fallbackOptions: [
          { type: 'cash_back', cpp: 1.0, label: 'Cash back' },
          { type: 'travel_portal', cpp: 1.25, label: 'Chase Travel portal' },
          { type: 'pay_with_points', cpp: 0.8, label: 'Pay with points' },
          { type: 'gift_cards', cpp: 1.0, label: 'Gift cards' },
          { type: 'merchandise', cpp: 0.6, label: 'Merchandise' }
        ],
        transferPartners: [
          { partner: 'World of Hyatt', ratio: '1:1', bestCpp: 2.2, sweetSpot: 'Category 1-4 hotels and peak Park Hyatt stays.', surcharges: 'low', flexibility: 'high', availability: 'high', cabinType: 'midrangeHotel' },
          { partner: 'United MileagePlus', ratio: '1:1', bestCpp: 1.8, sweetSpot: 'Domestic saver space and Polaris redemptions.', surcharges: 'low', flexibility: 'high', availability: 'medium', cabinType: 'business' },
          { partner: 'Air France/KLM Flying Blue', ratio: '1:1', bestCpp: 2.1, sweetSpot: 'Promo Rewards and Europe business class.', surcharges: 'medium', flexibility: 'medium', availability: 'medium', cabinType: 'business' },
          { partner: 'Southwest Rapid Rewards', ratio: '1:1', bestCpp: 1.4, sweetSpot: 'Simple domestic flights with no change fees.', surcharges: 'low', flexibility: 'high', availability: 'high', cabinType: 'economy' },
          { partner: 'British Airways Avios', ratio: '1:1', bestCpp: 1.6, sweetSpot: 'Short-haul oneworld partner flights.', surcharges: 'high', flexibility: 'medium', availability: 'medium', cabinType: 'economy' },
          { partner: 'Singapore KrisFlyer', ratio: '1:1', bestCpp: 2.5, sweetSpot: 'Long-haul premium cabins to Asia.', surcharges: 'medium', flexibility: 'low', availability: 'low', cabinType: 'first' },
          { partner: 'Virgin Atlantic Flying Club', ratio: '1:1', bestCpp: 2.8, sweetSpot: 'ANA premium cabin redemptions to Japan.', surcharges: 'high', flexibility: 'medium', availability: 'low', cabinType: 'first' },
          { partner: 'IHG One Rewards', ratio: '1:1', bestCpp: 0.6, sweetSpot: 'Low-category hotels when cash rates spike.', surcharges: 'low', flexibility: 'medium', availability: 'high', cabinType: 'midrangeHotel' }
        ],
        cards: [
          makeCard('Sapphire Preferred', 95, { dining: 3, travel: 2, streaming: 3 }),
          makeCard('Sapphire Reserve', 550, { dining: 3, travel: 3, streaming: 3 }),
          makeCard('Freedom Unlimited', 0, { dining: 3, other: 1.5 }),
          makeCard('Freedom Flex', 0, { dining: 3 }, { drugstores: 3 })
        ]
      },
      'American Express Membership Rewards': {
        slug: 'amex-mr',
        type: 'flexible',
        currency: 'points',
        cpp: 2.0,
        fallbackOptions: [
          { type: 'cash_back', cpp: 0.6, label: 'Statement credit' },
          { type: 'travel_portal', cpp: 1.0, label: 'Amex Travel portal' },
          { type: 'pay_with_points', cpp: 0.7, label: 'Pay with points' },
          { type: 'gift_cards', cpp: 1.0, label: 'Gift cards' },
          { type: 'merchandise', cpp: 0.5, label: 'Merchandise' }
        ],
        transferPartners: [
          { partner: 'ANA Mileage Club', ratio: '1:1', bestCpp: 3.5, sweetSpot: 'Roundtrip business class to Japan.', surcharges: 'medium', flexibility: 'medium', availability: 'low', cabinType: 'business' },
          { partner: 'Virgin Atlantic Flying Club', ratio: '1:1', bestCpp: 2.8, sweetSpot: 'ANA first class and Delta flash sales.', surcharges: 'high', flexibility: 'medium', availability: 'low', cabinType: 'first' },
          { partner: 'Air Canada Aeroplan', ratio: '1:1', bestCpp: 2.0, sweetSpot: 'Star Alliance business class with stopovers.', surcharges: 'low', flexibility: 'high', availability: 'medium', cabinType: 'business' },
          { partner: 'Singapore KrisFlyer', ratio: '1:1', bestCpp: 2.5, sweetSpot: 'Suites and long-haul premium cabins.', surcharges: 'medium', flexibility: 'low', availability: 'low', cabinType: 'first' },
          { partner: 'British Airways Avios', ratio: '1:1', bestCpp: 1.6, sweetSpot: 'Off-peak short-haul partner awards.', surcharges: 'high', flexibility: 'medium', availability: 'medium', cabinType: 'economy' },
          { partner: 'Delta SkyMiles', ratio: '1:1', bestCpp: 1.3, sweetSpot: 'Domestic flash sales and close-in flights.', surcharges: 'low', flexibility: 'high', availability: 'medium', cabinType: 'economy' },
          { partner: 'Hilton Honors', ratio: '1:2', bestCpp: 1.0, sweetSpot: 'Best during transfer bonuses or fifth-night stays.', surcharges: 'low', flexibility: 'medium', availability: 'high', cabinType: 'luxuryHotel' },
          { partner: 'Marriott Bonvoy', ratio: '1:1', bestCpp: 1.0, sweetSpot: 'Selective off-peak and resort nights.', surcharges: 'low', flexibility: 'medium', availability: 'medium', cabinType: 'resort' }
        ],
        cards: [
          makeCard('Gold', 250, { dining: 4, groceries: 4, travel: 3 }),
          makeCard('Platinum', 695, { travel: 5 }),
          makeCard('Green', 150, { dining: 3, travel: 3 }, { transit: 3 })
        ]
      },
      'Capital One Miles': {
        slug: 'capital-one-miles',
        type: 'flexible',
        currency: 'miles',
        cpp: 1.85,
        fallbackOptions: [
          { type: 'cash_back', cpp: 0.5, label: 'Statement credit' },
          { type: 'travel_portal', cpp: 1.0, label: 'Capital One Travel' },
          { type: 'gift_cards', cpp: 0.8, label: 'Gift cards' }
        ],
        transferPartners: [
          { partner: 'Air Canada Aeroplan', ratio: '1:1', bestCpp: 2.0, sweetSpot: 'Star Alliance premium cabins with stopovers.', surcharges: 'low', flexibility: 'high', availability: 'medium', cabinType: 'business' },
          { partner: 'Turkish Miles&Smiles', ratio: '1:1', bestCpp: 2.5, sweetSpot: 'High-value domestic Star Alliance awards.', surcharges: 'low', flexibility: 'medium', availability: 'low', cabinType: 'business' },
          { partner: 'British Airways Avios', ratio: '1:1', bestCpp: 1.6, sweetSpot: 'Short-haul partner flights and domestic hops.', surcharges: 'high', flexibility: 'medium', availability: 'medium', cabinType: 'economy' },
          { partner: 'Wyndham Rewards', ratio: '1:1', bestCpp: 1.2, sweetSpot: 'Vacasa rentals and all-inclusive stays.', surcharges: 'low', flexibility: 'medium', availability: 'medium', cabinType: 'resort' }
        ],
        cards: [
          makeCard('Venture X', 395, { travel: 2, other: 2 }),
          makeCard('Venture', 95, { travel: 2, other: 2 }),
          makeCard('Savor', 95, { dining: 4, groceries: 3, streaming: 4 }, { entertainment: 4 })
        ]
      },
      'Citi ThankYou Points': {
        slug: 'citi-ty',
        type: 'flexible',
        currency: 'points',
        cpp: 1.8,
        fallbackOptions: [
          { type: 'cash_back', cpp: 1.0, label: 'Cash back' },
          { type: 'travel_portal', cpp: 1.0, label: 'Citi Travel' },
          { type: 'gift_cards', cpp: 1.0, label: 'Gift cards' }
        ],
        transferPartners: [
          { partner: 'Turkish Miles&Smiles', ratio: '1:1', bestCpp: 2.5, sweetSpot: 'Star Alliance premium cabins and domestic saver awards.', surcharges: 'low', flexibility: 'medium', availability: 'low', cabinType: 'business' },
          { partner: 'Air France/KLM Flying Blue', ratio: '1:1', bestCpp: 2.1, sweetSpot: 'Europe promo awards and business class.', surcharges: 'medium', flexibility: 'medium', availability: 'medium', cabinType: 'business' },
          { partner: 'Singapore KrisFlyer', ratio: '1:1', bestCpp: 2.5, sweetSpot: 'Long-haul premium cabins and stopovers.', surcharges: 'medium', flexibility: 'low', availability: 'low', cabinType: 'first' },
          { partner: 'Virgin Atlantic Flying Club', ratio: '1:1', bestCpp: 2.8, sweetSpot: 'ANA first or business class.', surcharges: 'high', flexibility: 'medium', availability: 'low', cabinType: 'first' }
        ],
        cards: [
          makeCard('Premier', 95, { travel: 3, dining: 3, groceries: 3, gas: 3 }),
          makeCard('Double Cash', 0, { other: 2 })
        ]
      },
      'Bilt Rewards': {
        slug: 'bilt-rewards',
        type: 'flexible',
        currency: 'points',
        cpp: 2.0,
        fallbackOptions: [
          { type: 'cash_back', cpp: 0.5, label: 'Statement credit' },
          { type: 'travel_portal', cpp: 1.25, label: 'Bilt Travel portal' },
          { type: 'gift_cards', cpp: 0.8, label: 'Gift cards' }
        ],
        transferPartners: [
          { partner: 'World of Hyatt', ratio: '1:1', bestCpp: 2.2, sweetSpot: 'Low-category Hyatt and premium city hotels.', surcharges: 'low', flexibility: 'high', availability: 'high', cabinType: 'midrangeHotel' },
          { partner: 'Air Canada Aeroplan', ratio: '1:1', bestCpp: 2.0, sweetSpot: 'Star Alliance business class awards.', surcharges: 'low', flexibility: 'high', availability: 'medium', cabinType: 'business' },
          { partner: 'Turkish Miles&Smiles', ratio: '1:1', bestCpp: 2.5, sweetSpot: 'Domestic United awards at low mileage rates.', surcharges: 'low', flexibility: 'medium', availability: 'low', cabinType: 'business' },
          { partner: 'American Airlines AAdvantage', ratio: '1:1', bestCpp: 1.5, sweetSpot: 'Web specials and off-peak flights.', surcharges: 'low', flexibility: 'medium', availability: 'medium', cabinType: 'economy' },
          { partner: 'United MileagePlus', ratio: '1:1', bestCpp: 1.8, sweetSpot: 'Polaris or partner saver space.', surcharges: 'low', flexibility: 'high', availability: 'medium', cabinType: 'business' },
          { partner: 'IHG One Rewards', ratio: '1:1', bestCpp: 0.6, sweetSpot: 'Cheap airport hotels or last-minute stays.', surcharges: 'low', flexibility: 'medium', availability: 'high', cabinType: 'budgetHotel' }
        ],
        cards: [
          makeCard('Bilt Mastercard', 0, { dining: 3, travel: 2 }, { rent: 1 })
        ]
      },
      'Delta SkyMiles': {
        slug: 'delta-sm',
        type: 'airline',
        currency: 'miles',
        cpp: 1.3,
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.3, label: 'Delta flights' },
          { type: 'gift_cards', cpp: 1.0, label: 'Gift cards' },
          { type: 'pay_with_points', cpp: 1.0, label: 'Pay with Miles' },
          { type: 'merchandise', cpp: 0.7, label: 'Marketplace' }
        ],
        transferPartners: [],
        cards: []
      },
      'United MileagePlus': {
        slug: 'united-mp',
        type: 'airline',
        currency: 'miles',
        cpp: 1.4,
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.4, label: 'United flights' },
          { type: 'gift_cards', cpp: 1.0, label: 'Gift cards' },
          { type: 'merchandise', cpp: 0.6, label: 'Merchandise' }
        ],
        transferPartners: [],
        cards: []
      },
      'American Airlines AAdvantage': {
        slug: 'aa-aadvantage',
        type: 'airline',
        currency: 'miles',
        cpp: 1.5,
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.5, label: 'AA flights' },
          { type: 'gift_cards', cpp: 0.8, label: 'Gift cards' },
          { type: 'merchandise', cpp: 0.5, label: 'Merchandise' }
        ],
        transferPartners: [],
        cards: []
      },
      'Southwest Rapid Rewards': {
        slug: 'southwest-rr',
        type: 'airline',
        currency: 'points',
        cpp: 1.4,
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.4, label: 'Southwest flights' },
          { type: 'gift_cards', cpp: 0.8, label: 'Gift cards' }
        ],
        transferPartners: [],
        cards: []
      },
      'Alaska Mileage Plan': {
        slug: 'alaska-mp',
        type: 'airline',
        currency: 'miles',
        cpp: 1.8,
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.8, label: 'Alaska and partner flights' },
          { type: 'gift_cards', cpp: 0.8, label: 'Gift cards' }
        ],
        transferPartners: [],
        cards: []
      },
      'JetBlue TrueBlue': {
        slug: 'jetblue-trueblue',
        type: 'airline',
        currency: 'points',
        cpp: 1.3,
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.3, label: 'JetBlue flights' },
          { type: 'gift_cards', cpp: 0.8, label: 'Gift cards' }
        ],
        transferPartners: [],
        cards: []
      },
      'Marriott Bonvoy': {
        slug: 'marriott-bonvoy',
        type: 'hotel',
        currency: 'points',
        cpp: 0.9,
        fallbackOptions: [
          { type: 'travel_booking', cpp: 0.9, label: 'Marriott hotels' },
          { type: 'gift_cards', cpp: 0.7, label: 'Gift cards' },
          { type: 'merchandise', cpp: 0.4, label: 'Merchandise' }
        ],
        transferPartners: [
          { partner: 'Airline transfers', ratio: '3:1', bestCpp: 1.0, sweetSpot: 'Transfer 60k Marriott for 25k airline miles.', surcharges: 'low', flexibility: 'medium', availability: 'high', cabinType: 'economy' }
        ],
        cards: []
      },
      'Hilton Honors': {
        slug: 'hilton-honors',
        type: 'hotel',
        currency: 'points',
        cpp: 0.6,
        fallbackOptions: [
          { type: 'travel_booking', cpp: 0.6, label: 'Hilton hotels' },
          { type: 'gift_cards', cpp: 0.5, label: 'Gift cards' },
          { type: 'experiences', cpp: 0.4, label: 'Experiences' }
        ],
        transferPartners: [],
        cards: []
      },
      'World of Hyatt': {
        slug: 'hyatt-woh',
        type: 'hotel',
        currency: 'points',
        cpp: 2.0,
        fallbackOptions: [
          { type: 'travel_booking', cpp: 2.0, label: 'Hyatt hotels' },
          { type: 'gift_cards', cpp: 0.8, label: 'Gift cards' }
        ],
        transferPartners: [],
        cards: []
      },
      'IHG One Rewards': {
        slug: 'ihg-one',
        type: 'hotel',
        currency: 'points',
        cpp: 0.6,
        fallbackOptions: [
          { type: 'travel_booking', cpp: 0.6, label: 'IHG hotels' },
          { type: 'merchandise', cpp: 0.4, label: 'Merchandise' }
        ],
        transferPartners: [],
        cards: []
      },
      'Wyndham Rewards': {
        slug: 'wyndham-rewards',
        type: 'hotel',
        currency: 'points',
        cpp: 1.1,
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.1, label: 'Wyndham hotels' },
          { type: 'gift_cards', cpp: 0.7, label: 'Gift cards' }
        ],
        transferPartners: [],
        cards: []
      }
    },
    expirationRules: {
      'Delta SkyMiles': { expires: false },
      'United MileagePlus': { expires: true, inactivityMonths: 18 },
      'American Airlines AAdvantage': { expires: false },
      'Southwest Rapid Rewards': { expires: true, inactivityMonths: 24 },
      'Alaska Mileage Plan': { expires: true, inactivityMonths: 24 },
      'JetBlue TrueBlue': { expires: true, inactivityMonths: 24 },
      'Marriott Bonvoy': { expires: true, inactivityMonths: 24 },
      'Hilton Honors': { expires: true, inactivityMonths: 15 },
      'World of Hyatt': { expires: true, inactivityMonths: 24 },
      'IHG One Rewards': { expires: true, inactivityMonths: 12 },
      'Wyndham Rewards': { expires: true, inactivityMonths: 18 },
      'Chase Ultimate Rewards': { expires: false },
      'American Express Membership Rewards': { expires: false },
      'Capital One Miles': { expires: false },
      'Citi ThankYou Points': { expires: false },
      'Bilt Rewards': { expires: false }
    }
  };

  window.PROGRAMS = PROGRAMS;
})();
