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

  function makeRotatingCategory(quarter, multiplier, categories, note) {
    return {
      quarter: quarter,
      multiplier: Number(multiplier) || 1,
      categories: Array.isArray(categories) ? categories.slice() : [],
      note: note || ''
    };
  }

  function makeCard(name, annualFee, rates, extras, options) {
    options = options || {};
    return {
      name: name,
      annualFee: annualFee,
      network: options.network || '',
      earnRates: makeEarnRates(rates, extras),
      rotatingCategories: Array.isArray(options.rotatingCategories) ? options.rotatingCategories.slice() : []
    };
  }

  var PROGRAMS = {
    lastUpdated: '2026-03-24',
    categoryAliases: {
      dining: 'dining',
      restaurant: 'dining',
      restaurants: 'dining',
      food: 'dining',
      takeout: 'dining',
      takeaway: 'dining',
      cafe: 'dining',
      cafes: 'dining',
      coffee: 'dining',
      groceries: 'groceries',
      grocery: 'groceries',
      supermarket: 'groceries',
      supermarkets: 'groceries',
      supermarketspurchases: 'groceries',
      gas: 'gas',
      fuel: 'gas',
      'gas station': 'gas',
      'gas stations': 'gas',
      'ev charging': 'gas',
      travel: 'travel',
      'travel and transit': 'travel',
      'travel & transit': 'travel',
      transit: 'transit',
      commuting: 'transit',
      commute: 'transit',
      rideshare: 'transit',
      rideshares: 'transit',
      subway: 'transit',
      train: 'transit',
      bus: 'transit',
      parking: 'transit',
      tolls: 'transit',
      airline: 'airline',
      airfare: 'airline',
      flight: 'airline',
      flights: 'airline',
      air: 'airline',
      hotel: 'hotel',
      hotels: 'hotel',
      lodging: 'hotel',
      stay: 'hotel',
      stays: 'hotel',
      streaming: 'streaming',
      netflix: 'streaming',
      hulu: 'streaming',
      spotify: 'streaming',
      'online shopping': 'onlineShopping',
      shopping: 'onlineShopping',
      ecommerce: 'onlineShopping',
      'e-commerce': 'onlineShopping',
      amazon: 'onlineShopping',
      pharmacy: 'drugstores',
      pharmacies: 'drugstores',
      drugstore: 'drugstores',
      drugstores: 'drugstores',
      entertainment: 'entertainment',
      concerts: 'entertainment',
      movies: 'entertainment',
      movie: 'entertainment',
      rent: 'rent',
      renter: 'rent',
      'phone bill': 'phone',
      phone: 'phone',
      internet: 'phone',
      cable: 'phone',
      wireless: 'phone',
      delta: 'delta',
      skymiles: 'delta',
      'sky miles': 'delta',
      united: 'united',
      mileageplus: 'united',
      'american airlines': 'americanAirlines',
      american: 'americanAirlines',
      aa: 'americanAirlines',
      aadvantage: 'americanAirlines',
      southwest: 'southwest',
      'rapid rewards': 'southwest',
      alaska: 'alaska',
      hawaiian: 'alaska',
      jetblue: 'jetblue',
      trueblue: 'jetblue',
      marriott: 'marriott',
      bonvoy: 'marriott',
      hilton: 'hilton',
      hyatt: 'hyatt',
      ihg: 'ihg',
      kimpton: 'ihg',
      intercontinental: 'ihg',
      wyndham: 'wyndham',
      vacasa: 'wyndham',
      other: 'other'
    },
    programs: {
      'Chase Ultimate Rewards': {
        slug: 'chase-ur',
        type: 'flexible',
        currency: 'points',
        cpp: 2.0,
        loginUrl: 'https://ultimaterewardspoints.chase.com',
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
          makeCard('Sapphire Preferred', 95, { dining: 3, travel: 2, streaming: 3 }, null, { network: 'Visa' }),
          makeCard('Sapphire Reserve', 550, { dining: 3, travel: 3, streaming: 3 }, null, { network: 'Visa' }),
          makeCard('Freedom Unlimited', 0, { dining: 3, other: 1.5 }, { drugstores: 3 }, { network: 'Visa' }),
          makeCard('Freedom Flex', 0, { dining: 3 }, { drugstores: 3 }, {
            network: 'Mastercard',
            rotatingCategories: [
              makeRotatingCategory(1, 5, ['groceries'], 'Quarterly bonus categories require activation.')
            ]
          })
        ]
      },
      'American Express Membership Rewards': {
        slug: 'amex-mr',
        type: 'flexible',
        currency: 'points',
        cpp: 2.0,
        loginUrl: 'https://global.americanexpress.com/rewards',
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
          makeCard('Gold', 250, { dining: 4, groceries: 4, travel: 3 }, null, { network: 'Amex' }),
          makeCard('Platinum', 695, { travel: 5 }, null, { network: 'Amex' }),
          makeCard('Green', 150, { dining: 3, travel: 3 }, { transit: 3 }, { network: 'Amex' })
        ]
      },
      'Capital One Miles': {
        slug: 'capital-one-miles',
        type: 'flexible',
        currency: 'miles',
        cpp: 1.85,
        loginUrl: 'https://myaccounts.capitalone.com/rewards',
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
          makeCard('Venture X', 395, { travel: 2, other: 2 }, null, { network: 'Visa' }),
          makeCard('Venture', 95, { travel: 2, other: 2 }, null, { network: 'Visa' }),
          makeCard('Savor', 95, { dining: 4, groceries: 3, streaming: 4 }, { entertainment: 4 }, { network: 'Mastercard' })
        ]
      },
      'Citi ThankYou Points': {
        slug: 'citi-ty',
        type: 'flexible',
        currency: 'points',
        cpp: 1.8,
        loginUrl: 'https://www.thankyou.com/account',
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
          makeCard('Premier', 95, { travel: 3, dining: 3, groceries: 3, gas: 3 }, null, { network: 'Mastercard' }),
          makeCard('Double Cash', 0, { other: 2 }, null, { network: 'Mastercard' })
        ]
      },
      'Bilt Rewards': {
        slug: 'bilt-rewards',
        type: 'flexible',
        currency: 'points',
        cpp: 2.0,
        loginUrl: 'https://www.bfrealrewards.com/account',
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
          makeCard('Bilt Mastercard', 0, { dining: 3, travel: 2 }, { rent: 1 }, { network: 'Mastercard' })
        ]
      },
      'Delta SkyMiles': {
        slug: 'delta-sm',
        type: 'airline',
        currency: 'miles',
        cpp: 1.3,
        loginUrl: 'https://www.delta.com/myprofile/personal-details',
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.3, label: 'Delta flights' },
          { type: 'gift_cards', cpp: 1.0, label: 'Gift cards' },
          { type: 'pay_with_points', cpp: 1.0, label: 'Pay with Miles' },
          { type: 'merchandise', cpp: 0.7, label: 'Marketplace' }
        ],
        transferPartners: [],
        cards: [
          makeCard('Delta SkyMiles Platinum', 350, { dining: 2, groceries: 2 }, { delta: 3, hotel: 3 }, { network: 'Amex' })
        ]
      },
      'United MileagePlus': {
        slug: 'united-mp',
        type: 'airline',
        currency: 'miles',
        cpp: 1.4,
        loginUrl: 'https://www.united.com/ual/en/us/fly/mileageplus/myaccount.html',
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.4, label: 'United flights' },
          { type: 'gift_cards', cpp: 1.0, label: 'Gift cards' },
          { type: 'merchandise', cpp: 0.6, label: 'Merchandise' }
        ],
        transferPartners: [],
        cards: [
          makeCard('United Explorer', 150, { dining: 2, hotel: 2 }, { united: 2 }, { network: 'Visa' })
        ]
      },
      'American Airlines AAdvantage': {
        slug: 'aa-aadvantage',
        type: 'airline',
        currency: 'miles',
        cpp: 1.5,
        loginUrl: 'https://www.aa.com/aadvantage-program/profile/account-summary',
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.5, label: 'AA flights' },
          { type: 'gift_cards', cpp: 0.8, label: 'Gift cards' },
          { type: 'merchandise', cpp: 0.5, label: 'Merchandise' }
        ],
        transferPartners: [],
        cards: [
          makeCard('AAdvantage Platinum Select', 99, { dining: 2, gas: 2 }, { americanAirlines: 2 }, { network: 'Mastercard' })
        ]
      },
      'Southwest Rapid Rewards': {
        slug: 'southwest-rr',
        type: 'airline',
        currency: 'points',
        cpp: 1.4,
        loginUrl: 'https://www.southwest.com/account',
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.4, label: 'Southwest flights' },
          { type: 'gift_cards', cpp: 0.8, label: 'Gift cards' }
        ],
        transferPartners: [],
        cards: [
          makeCard('Southwest Priority', 229, { transit: 2, streaming: 2 }, { southwest: 4, phone: 2 }, { network: 'Visa' })
        ]
      },
      'Alaska Mileage Plan': {
        slug: 'alaska-mp',
        type: 'airline',
        currency: 'miles',
        cpp: 1.8,
        loginUrl: 'https://www.alaskaair.com/account/overview',
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.8, label: 'Alaska and partner flights' },
          { type: 'gift_cards', cpp: 0.8, label: 'Gift cards' }
        ],
        transferPartners: [],
        cards: [
          makeCard('Alaska Visa Signature', 95, { dining: 3, gas: 3, transit: 3, streaming: 3 }, { alaska: 3 }, { network: 'Visa' })
        ]
      },
      'JetBlue TrueBlue': {
        slug: 'jetblue-trueblue',
        type: 'airline',
        currency: 'points',
        cpp: 1.3,
        loginUrl: 'https://www.jetblue.com/trueblue/account-summary',
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.3, label: 'JetBlue flights' },
          { type: 'gift_cards', cpp: 0.8, label: 'Gift cards' }
        ],
        transferPartners: [],
        cards: [
          makeCard('JetBlue Plus', 99, { dining: 2, groceries: 2 }, { jetblue: 6 }, { network: 'Mastercard' })
        ]
      },
      'Marriott Bonvoy': {
        slug: 'marriott-bonvoy',
        type: 'hotel',
        currency: 'points',
        cpp: 0.9,
        loginUrl: 'https://www.marriott.com/loyalty/myAccount/default.mi',
        fallbackOptions: [
          { type: 'travel_booking', cpp: 0.9, label: 'Marriott hotels' },
          { type: 'gift_cards', cpp: 0.7, label: 'Gift cards' },
          { type: 'merchandise', cpp: 0.4, label: 'Merchandise' }
        ],
        transferPartners: [
          { partner: 'Airline transfers', ratio: '3:1', bestCpp: 1.0, sweetSpot: 'Transfer 60k Marriott for 25k airline miles.', surcharges: 'low', flexibility: 'medium', availability: 'high', cabinType: 'economy' }
        ],
        cards: [
          makeCard('Marriott Bonvoy Boundless', 95, { dining: 3, gas: 3, groceries: 3 }, { marriott: 6 }, { network: 'Visa' })
        ]
      },
      'Hilton Honors': {
        slug: 'hilton-honors',
        type: 'hotel',
        currency: 'points',
        cpp: 0.6,
        loginUrl: 'https://www.hilton.com/en/hilton-honors/guest/account/',
        fallbackOptions: [
          { type: 'travel_booking', cpp: 0.6, label: 'Hilton hotels' },
          { type: 'gift_cards', cpp: 0.5, label: 'Gift cards' },
          { type: 'experiences', cpp: 0.4, label: 'Experiences' }
        ],
        transferPartners: [],
        cards: [
          makeCard('Hilton Honors Surpass', 150, { dining: 6, groceries: 6, gas: 6 }, { hilton: 12 }, { network: 'Amex' })
        ]
      },
      'World of Hyatt': {
        slug: 'hyatt-woh',
        type: 'hotel',
        currency: 'points',
        cpp: 2.0,
        loginUrl: 'https://world.hyatt.com/content/gp/en/rewards/my-account.html',
        fallbackOptions: [
          { type: 'travel_booking', cpp: 2.0, label: 'Hyatt hotels' },
          { type: 'gift_cards', cpp: 0.8, label: 'Gift cards' }
        ],
        transferPartners: [],
        cards: [
          makeCard('World of Hyatt', 95, { dining: 2, airline: 2, transit: 2 }, { hyatt: 4 }, { network: 'Visa' })
        ]
      },
      'IHG One Rewards': {
        slug: 'ihg-one',
        type: 'hotel',
        currency: 'points',
        cpp: 0.6,
        loginUrl: 'https://www.ihg.com/rewardsclub/us/en/account/home',
        fallbackOptions: [
          { type: 'travel_booking', cpp: 0.6, label: 'IHG hotels' },
          { type: 'merchandise', cpp: 0.4, label: 'Merchandise' }
        ],
        transferPartners: [],
        cards: [
          makeCard('IHG One Rewards Premier', 99, { travel: 5, gas: 5, dining: 5 }, { ihg: 10 }, { network: 'Mastercard' })
        ]
      },
      'Wyndham Rewards': {
        slug: 'wyndham-rewards',
        type: 'hotel',
        currency: 'points',
        cpp: 1.1,
        loginUrl: 'https://www.wyndhamhotels.com/wyndham-rewards/account/dashboard',
        fallbackOptions: [
          { type: 'travel_booking', cpp: 1.1, label: 'Wyndham hotels' },
          { type: 'gift_cards', cpp: 0.7, label: 'Gift cards' }
        ],
        transferPartners: [],
        cards: [
          makeCard('Wyndham Rewards Earner Plus', 75, { gas: 6, dining: 4, groceries: 4 }, { wyndham: 6 }, { network: 'Mastercard' })
        ]
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

  /*
    `bestCpp` is an optimistic upside figure for a transfer path, not a guaranteed realized value.
    Wallet and Advisor both route through the shared adjusted ceiling model before recommending
    a card or redemption path, so raw `bestCpp` should be treated as an upper-bound input only.
  */

  window.PROGRAMS = PROGRAMS;
})();
