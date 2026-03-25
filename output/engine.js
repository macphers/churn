(function () {
  'use strict';

  function round(value, digits) {
    var scale = Math.pow(10, digits || 0);
    return Math.round((Number(value) || 0) * scale) / scale;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function hospitalityKey(cabinType, prefs) {
    if (cabinType === 'hotel') return prefs.hotelPref || 'midrangeHotel';
    if (cabinType === 'midrange') return 'midrangeHotel';
    if (cabinType === 'luxury') return 'luxuryHotel';
    return cabinType;
  }

  function capKeyForCabin(cabinType, prefs) {
    var key = hospitalityKey(cabinType, prefs);
    if (prefs && prefs.wtpCaps && prefs.wtpCaps[key] != null) return key;
    return null;
  }

  function applyWTP(rawValue, cabinType, prefs) {
    var key = capKeyForCabin(cabinType, prefs || {});
    if (!key) return round(rawValue, 0);
    var cap = Number(prefs.wtpCaps[key]);
    if (!isFinite(cap) || cap <= 0) return round(rawValue, 0);
    if (rawValue <= cap) return round(rawValue, 0);
    return round(cap + (rawValue - cap) * 0.35, 0);
  }

  function calcNetCpp(balance, bestCpp, surchargeData) {
    var surcharges = surchargeData && surchargeData.surcharges || 'low';
    var availability = surchargeData && surchargeData.availability || 'high';
    var flexibility = surchargeData && surchargeData.flexibility || 'medium';
    var surchargePenalty = { low: 0.02, medium: 0.11, high: 0.24 }[surcharges] || 0;
    var availabilityPenalty = { high: 0, medium: 0.04, low: 0.1 }[availability] || 0;
    var flexibilityBonus = { high: 0.05, medium: 0.02, low: 0 }[flexibility] || 0;
    return round(Math.max(0.3, Number(bestCpp || 0) * (1 - surchargePenalty - availabilityPenalty + flexibilityBonus)), 2);
  }

  function complexityLevel(option) {
    if (option.kind === 'transfer_partner') {
      if (option.availability === 'low' || option.flexibility === 'low') return 'high';
      return 'medium';
    }
    if (option.type === 'cash_back' || option.type === 'gift_cards' || option.type === 'travel_booking') return 'low';
    return 'medium';
  }

  function complexityScore(level) {
    return { low: 1, medium: 0.7, high: 0.4 }[level] || 0.7;
  }

  function availabilityScore(level) {
    return { high: 1, medium: 0.72, low: 0.42 }[level] || 0.72;
  }

  function flexibilityScore(level) {
    return { high: 1, medium: 0.72, low: 0.44 }[level] || 0.72;
  }

  function surchargeScore(level) {
    return { low: 1, medium: 0.65, high: 0.32 }[level] || 0.65;
  }

  function preferenceFit(cabinType, prefs) {
    prefs = prefs || {};
    if (!cabinType || cabinType === 'cash') return 0.82;
    if (cabinType.indexOf('Hotel') > -1 || cabinType === 'resort') {
      var hotelRank = { budgetHotel: 1, midrangeHotel: 2, luxuryHotel: 3, resort: 4 };
      var desiredHotel = hotelRank[prefs.hotelPref || 'midrangeHotel'] || 2;
      var actualHotel = hotelRank[cabinType] || desiredHotel;
      return clamp(1 - Math.abs(desiredHotel - actualHotel) * 0.18, 0.34, 1);
    }
    var cabinRank = { economy: 1, premiumEconomy: 2, business: 3, first: 4 };
    var desiredCabin = cabinRank[prefs.cabinPref || 'economy'] || 1;
    var actualCabin = cabinRank[cabinType] || desiredCabin;
    return clamp(1 - Math.abs(desiredCabin - actualCabin) * 0.2, 0.3, 1);
  }

  function luxuryFit(cabinType) {
    return { economy: 0.2, premiumEconomy: 0.45, business: 0.85, first: 1, budgetHotel: 0.2, midrangeHotel: 0.45, luxuryHotel: 0.9, resort: 1 }[cabinType] || 0.25;
  }

  function normalizeBaseOption(option, floor, prefs) {
    var floorValue = floor ? floor.adjustedValue : option.adjustedValue;
    var liftRatio = floorValue > 0 ? (option.adjustedValue - floorValue) / floorValue : 0;
    var valueComponent = clamp(55 + liftRatio * 45, 0, 100);
    var simplicityComponent = complexityScore(option.complexity) * 100;
    var availabilityComponent = availabilityScore(option.availability) * 100;
    var flexibilityComponent = flexibilityScore(option.flexibility) * 100;
    var preferenceComponent = preferenceFit(option.cabinType, prefs) * 100;
    var surchargeComponent = surchargeScore(option.surcharges) * 100;
    var baseScore = valueComponent * 0.38 + simplicityComponent * 0.16 + availabilityComponent * 0.16 + flexibilityComponent * 0.12 + preferenceComponent * 0.1 + surchargeComponent * 0.08;
    if (option.householdBalance > 0) baseScore += 4;
    return Object.assign({}, option, {
      floorValue: floorValue,
      liftRatio: round(liftRatio, 3),
      baseScore: round(baseScore, 1)
    });
  }

  function scoreBFB(option, floor, prefs, mode) {
    return normalizeBaseOption(option, floor, prefs);
  }

  function rankByMode(scoredOptions, mode) {
    return scoredOptions.map(function (option) {
      var score = option.baseScore;
      switch (mode) {
        case 'max_value':
          score += option.liftRatio * 32 + (option.kind === 'transfer_partner' ? 6 : 0);
          break;
        case 'min_cash':
          score += surchargeScore(option.surcharges) * 22 + (option.isNonTravel ? 12 : 0) + availabilityScore(option.availability) * 8;
          score -= option.surcharges === 'high' ? 12 : 0;
          break;
        case 'simple':
          score += complexityScore(option.complexity) * 28 + (option.isSimple ? 18 : -12);
          break;
        case 'travel_now':
          score += availabilityScore(option.availability) * 28 + flexibilityScore(option.flexibility) * 10;
          score -= option.availability === 'low' ? 16 : 0;
          break;
        case 'no_travel':
          score += option.isNonTravel ? 34 : -28;
          score += option.isSimple ? 10 : 0;
          break;
        case 'expiring':
          score += option.urgencyBoost || 0;
          score += option.isSimple ? 14 : 0;
          break;
        case 'luxury':
          score += luxuryFit(option.cabinType) * 34 + (option.kind === 'transfer_partner' ? 6 : 0);
          break;
      }
      return Object.assign({}, option, { modeScore: round(score, 1) });
    }).sort(function (left, right) {
      return right.modeScore - left.modeScore;
    });
  }

  function fallbackCabinType(program, fallbackType, prefs) {
    if (fallbackType === 'cash_back' || fallbackType === 'gift_cards' || fallbackType === 'merchandise') return 'cash';
    if (program && program.type === 'hotel') return program.cpp >= 1.5 ? 'luxuryHotel' : 'midrangeHotel';
    return prefs.cabinPref || 'economy';
  }

  function buildFallbackOptions(account, program, prefs, householdBalance) {
    var fallbackOptions = program && Array.isArray(program.fallbackOptions) && program.fallbackOptions.length
      ? program.fallbackOptions
      : [{ type: 'cash_back', cpp: account.cpp || 1, label: 'Cash back' }];
    return fallbackOptions.map(function (item) {
      var rawValue = account.balance * item.cpp / 100;
      var cabinType = fallbackCabinType(program, item.type, prefs);
      var adjustedValue = item.type === 'cash_back' || item.type === 'gift_cards' || item.type === 'merchandise'
        ? rawValue
        : applyWTP(rawValue, cabinType, prefs);
      return {
        id: account.id + '-fallback-' + item.type,
        accountId: account.id,
        accountProgram: account.program,
        kind: 'fallback',
        type: item.type,
        label: item.label,
        rawCpp: round(item.cpp, 2),
        netCpp: round(item.cpp, 2),
        rawValue: round(rawValue, 0),
        adjustedValue: round(adjustedValue, 0),
        cabinType: cabinType,
        surcharges: 'low',
        availability: 'high',
        flexibility: item.type === 'travel_portal' ? 'medium' : 'high',
        complexity: item.type === 'travel_portal' ? 'medium' : 'low',
        sweetSpot: '',
        isTravel: item.type.indexOf('travel') === 0 || item.type === 'travel_booking' || item.type === 'pay_with_points',
        isSimple: true,
        isNonTravel: item.type === 'cash_back' || item.type === 'gift_cards' || item.type === 'merchandise',
        householdBalance: householdBalance || 0,
        urgencyBoost: 0
      };
    });
  }

  function buildTransferOptions(account, program, prefs, householdBalance) {
    if (!program || !Array.isArray(program.transferPartners) || !program.transferPartners.length) return [];
    return program.transferPartners.map(function (partner) {
      var netCpp = calcNetCpp(account.balance, partner.bestCpp, partner);
      var rawValue = account.balance * partner.bestCpp / 100;
      var adjustedValue = applyWTP(account.balance * netCpp / 100, partner.cabinType, prefs);
      var transferShape = {
        kind: 'transfer_partner',
        availability: partner.availability,
        flexibility: partner.flexibility
      };
      return {
        id: account.id + '-transfer-' + partner.partner,
        accountId: account.id,
        accountProgram: account.program,
        kind: 'transfer_partner',
        type: 'transfer_partner',
        label: partner.partner,
        rawCpp: round(partner.bestCpp, 2),
        netCpp: netCpp,
        rawValue: round(rawValue, 0),
        adjustedValue: round(adjustedValue, 0),
        cabinType: partner.cabinType,
        surcharges: partner.surcharges,
        availability: partner.availability,
        flexibility: partner.flexibility,
        complexity: complexityLevel(transferShape),
        sweetSpot: partner.sweetSpot,
        ratio: partner.ratio,
        isTravel: true,
        isSimple: false,
        isNonTravel: false,
        householdBalance: householdBalance || 0,
        urgencyBoost: 0
      };
    });
  }

  function checkExpiration(account, expirationRules) {
    var rule = expirationRules && expirationRules[account.program];
    if (!rule || !rule.expires) return null;
    var activityDate = account.lastActivityDate || account.lastUpdated;
    if (!activityDate) return { atRisk: true, expired: false, daysRemaining: null, message: 'Unknown last activity date.' };
    var lastUpdated = new Date(activityDate);
    if (isNaN(lastUpdated.getTime())) return { atRisk: true, expired: false, daysRemaining: null, message: 'Unknown last activity date.' };
    var expiresAt = new Date(lastUpdated);
    expiresAt.setMonth(expiresAt.getMonth() + rule.inactivityMonths);
    var daysRemaining = Math.ceil((expiresAt.getTime() - Date.now()) / 86400000);
    if (daysRemaining <= 0) return { atRisk: true, expired: true, daysRemaining: 0, message: 'Expired', expiresAt: expiresAt.toISOString().split('T')[0] };
    if (daysRemaining <= 180) {
      return { atRisk: true, expired: false, daysRemaining: daysRemaining, message: daysRemaining + ' days remaining', expiresAt: expiresAt.toISOString().split('T')[0] };
    }
    return null;
  }

  function analyzeAccount(rawAccount, prefs, household, options) {
    options = options || {};
    var account = Object.assign({}, rawAccount);
    account.balance = Math.max(0, Number(account.balance) || 0);
    account.cpp = Number(account.cpp) || 1;
    var program = typeof options.programFromAccount === 'function' ? options.programFromAccount(account) : null;
    var householdBalance = (Array.isArray(household) ? household : []).filter(function (member) {
      return member.programSlug && account.programSlug && member.programSlug === account.programSlug;
    }).reduce(function (sum, member) {
      return sum + member.balance;
    }, 0);
    var fallbackOptions = buildFallbackOptions(account, program, prefs, householdBalance);
    var cashFloor = fallbackOptions.find(function (option) { return option.type === 'cash_back'; }) || fallbackOptions[0];
    var transferOptions = prefs.interestedInTravel === false ? [] : buildTransferOptions(account, program, prefs, householdBalance);
    var expiration = checkExpiration(account, options.expirationRules || {});
    var urgencyBoost = expiration && expiration.atRisk ? (expiration.expired ? 24 : 16) : 0;
    var scored = rankByMode(fallbackOptions.concat(transferOptions).map(function (option) {
      option.urgencyBoost = urgencyBoost + (option.isSimple ? 6 : 0) + availabilityScore(option.availability) * 4;
      return scoreBFB(option, cashFloor, prefs, prefs.mode);
    }), prefs.mode);
    var bestOption = scored[0] || cashFloor;
    var bestSimple = scored.find(function (option) { return option.isSimple; }) || bestOption;
    var bestNonTravel = scored.find(function (option) { return option.isNonTravel; }) || bestSimple;
    var gapValue = Math.max(0, round(bestOption.adjustedValue - cashFloor.adjustedValue, 0));
    var gapPercent = cashFloor.adjustedValue > 0 ? round(gapValue / cashFloor.adjustedValue * 100, 0) : 0;
    return {
      account: account,
      program: program,
      householdBalance: householdBalance,
      floorOption: cashFloor,
      bestOption: bestOption,
      bestSimple: bestSimple,
      bestNonTravel: bestNonTravel,
      options: scored,
      fallbackOptions: fallbackOptions,
      transferOptions: transferOptions,
      expiration: expiration,
      leftOnTable: {
        gap: gapValue,
        gapPercent: gapPercent
      }
    };
  }

  function buildAnalysis(data, prefs, household, options) {
    options = options || {};
    var normalizedPrefs = typeof options.normalizePrefs === 'function'
      ? options.normalizePrefs(prefs, data)
      : prefs;
    var accounts = ((data && data.accounts) || []).map(function (account) {
      return analyzeAccount(account, normalizedPrefs, household, options);
    });
    var active = accounts.filter(function (item) { return item.account.balance > 0; });
    var totalBest = active.reduce(function (sum, item) { return sum + item.bestOption.adjustedValue; }, 0);
    var totalFloor = active.reduce(function (sum, item) { return sum + item.floorOption.adjustedValue; }, 0);
    var totalGap = Math.max(0, totalBest - totalFloor);
    var allOptions = active.map(function (item) {
      return item.options[0] ? Object.assign({ account: item.account }, item.options[0]) : null;
    }).filter(Boolean);
    var bestOverall = allOptions.slice().sort(function (left, right) { return right.modeScore - left.modeScore; })[0] || null;
    var bestSimple = active.map(function (item) {
      return Object.assign({ account: item.account }, item.bestSimple);
    }).sort(function (left, right) { return right.modeScore - left.modeScore; })[0] || null;
    var bestNonTravel = active.map(function (item) {
      return Object.assign({ account: item.account }, item.bestNonTravel);
    }).sort(function (left, right) { return right.modeScore - left.modeScore; })[0] || null;
    var expiring = active.filter(function (item) { return item.expiration && item.expiration.atRisk; }).sort(function (left, right) {
      return (left.expiration.daysRemaining || 9999) - (right.expiration.daysRemaining || 9999);
    });
    var sweetSpots = active.reduce(function (items, item) {
      item.options.filter(function (option) {
        return option.kind === 'transfer_partner' && option.rawCpp >= 1.8;
      }).forEach(function (option) {
        items.push({
          account: item.account,
          option: option
        });
      });
      return items;
    }, []).sort(function (left, right) {
      return right.option.modeScore - left.option.modeScore;
    });
    return {
      prefs: normalizedPrefs,
      household: household,
      accounts: accounts,
      activeAccounts: active,
      totalBest: round(totalBest, 0),
      totalFloor: round(totalFloor, 0),
      totalGap: round(totalGap, 0),
      bestOverall: bestOverall,
      bestSimple: bestSimple,
      bestNonTravel: bestNonTravel,
      expiring: expiring,
      sweetSpots: sweetSpots
    };
  }

  function scoreLabel(score) {
    if (!isFinite(score)) return 'Unscored';
    if (score >= 90) return 'Very strong fit';
    if (score >= 82) return 'Strong fit';
    if (score >= 72) return 'Good fit';
    if (score >= 62) return 'Worth considering';
    return 'Backup option';
  }

  function buildVerdictLine(analysis) {
    var best = analysis.bestOverall || analysis.bestSimple || analysis.bestNonTravel || null;
    var urgent = analysis.expiring[0] || null;
    if (urgent && urgent.expiration && urgent.expiration.atRisk) {
      return urgent.account.program + ' expiring: ' + (urgent.expiration.message || 'expiring') + '. Best move: ' + urgent.bestOption.label + ' ($' + Number(urgent.bestOption.adjustedValue || 0).toLocaleString() + ').';
    }
    if (!best) return 'Add more balances or update preferences for recommendations.';
    return 'Best opportunity: ' + best.account.program + ' via ' + best.label + ' ($' + Number(best.adjustedValue || 0).toLocaleString() + ').';
  }

  function getProgramCeilingCpp(program, account) {
    var values = [];
    if (account && Number(account.cpp) > 0) values.push(Number(account.cpp));
    if (program && Number(program.cpp) > 0) values.push(Number(program.cpp));
    if (program && Array.isArray(program.fallbackOptions)) {
      program.fallbackOptions.forEach(function (option) {
        if (Number(option.cpp) > 0) values.push(Number(option.cpp));
      });
    }
    if (program && Array.isArray(program.transferPartners)) {
      program.transferPartners.forEach(function (partner) {
        var netCpp = calcNetCpp(account && account.balance, partner.bestCpp, partner);
        if (Number(netCpp) > 0) values.push(Number(netCpp));
      });
    }
    return round(values.length ? Math.max.apply(Math, values) : 1, 2);
  }

  window.ChurnEngine = {
    round: round,
    clamp: clamp,
    applyWTP: applyWTP,
    calcNetCpp: calcNetCpp,
    complexityLevel: complexityLevel,
    complexityScore: complexityScore,
    availabilityScore: availabilityScore,
    flexibilityScore: flexibilityScore,
    surchargeScore: surchargeScore,
    preferenceFit: preferenceFit,
    luxuryFit: luxuryFit,
    scoreBFB: scoreBFB,
    rankByMode: rankByMode,
    buildFallbackOptions: buildFallbackOptions,
    buildTransferOptions: buildTransferOptions,
    checkExpiration: checkExpiration,
    analyzeAccount: analyzeAccount,
    buildAnalysis: buildAnalysis,
    scoreLabel: scoreLabel,
    buildVerdictLine: buildVerdictLine,
    getProgramCeilingCpp: getProgramCeilingCpp
  };
})();
