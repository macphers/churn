(function () {
  'use strict';

  function round(value, digits) {
    var scale = Math.pow(10, digits || 0);
    return Math.round((Number(value) || 0) * scale) / scale;
  }

  function normalizeText(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
  }

  function normalizeAliases(categoryAliases) {
    var aliases = {};
    var source = categoryAliases && typeof categoryAliases === 'object' ? categoryAliases : {};
    Object.keys(source).forEach(function (key) {
      var normalized = normalizeText(key);
      if (!normalized) return;
      aliases[normalized] = source[key];
      aliases[normalized.replace(/\s+/g, '')] = source[key];
    });
    return aliases;
  }

  function resolveCategory(category, categoryAliases) {
    var aliases = normalizeAliases(categoryAliases);
    var normalized = normalizeText(category);
    if (!normalized) return 'other';
    if (aliases[normalized]) return aliases[normalized];
    var compact = normalized.replace(/\s+/g, '');
    if (aliases[compact]) return aliases[compact];
    return 'other';
  }

  function getCurrentQuarter(dateInput) {
    var date = dateInput ? new Date(dateInput) : new Date();
    if (isNaN(date.getTime())) date = new Date();
    return Math.floor(date.getMonth() / 3) + 1;
  }

function getEffectiveMultiplier(card, category, options) {
  options = options || {};
  var safeCard = card && card.card ? card.card : (card || {});
  var resolvedCategory = resolveCategory(category, options.categoryAliases);
  var earnRates = safeCard.earnRates && typeof safeCard.earnRates === 'object' ? safeCard.earnRates : {};
  var baseMultiplier = Number(earnRates[resolvedCategory]);
  var bestMultiplier = isFinite(baseMultiplier) && baseMultiplier > 0 ? baseMultiplier : 1;
  var quarter = options.quarter || getCurrentQuarter(options.date);
  var rotating = Array.isArray(safeCard.rotatingCategories) ? safeCard.rotatingCategories : [];

  rotating.forEach(function (entry) {
    if (!entry || Number(entry.quarter) !== Number(quarter)) return;
    var categories = Array.isArray(entry.categories) ? entry.categories : [];
    var matches = categories.some(function (item) {
      return resolveCategory(item, options.categoryAliases) === resolvedCategory;
    });
    if (!matches) return;
    var rotatingMultiplier = Number(entry.multiplier);
    if (isFinite(rotatingMultiplier) && rotatingMultiplier > bestMultiplier) {
      bestMultiplier = rotatingMultiplier;
    }
  });

  return round(bestMultiplier, 2);
}

  function effectiveReturn(cardEntry, category, options) {
    options = options || {};
    var card = cardEntry && cardEntry.card ? cardEntry.card : cardEntry;
    var programBestCpp = Number(
      options.programBestCpp != null ? options.programBestCpp
        : cardEntry && cardEntry.programBestCpp != null ? cardEntry.programBestCpp
          : cardEntry && cardEntry.programCpp != null ? cardEntry.programCpp
            : cardEntry && cardEntry.cpp != null ? cardEntry.cpp
              : 1
    );
    if (!isFinite(programBestCpp) || programBestCpp <= 0) programBestCpp = 1;
    return round(getEffectiveMultiplier(card, category, options) * programBestCpp, 2);
  }

  function sortRanked(left, right) {
    if (right.returnCpp !== left.returnCpp) return right.returnCpp - left.returnCpp;
    if (right.multiplier !== left.multiplier) return right.multiplier - left.multiplier;
    if ((left.card.annualFee || 0) !== (right.card.annualFee || 0)) {
      return (left.card.annualFee || 0) - (right.card.annualFee || 0);
    }
    return String(left.card.name || '').localeCompare(String(right.card.name || ''));
  }

  function normalizeRankedEntry(entry, category, options) {
    var card = entry && entry.card ? entry.card : entry;
    var multiplier = getEffectiveMultiplier(card, category, options);
    var returnCpp = effectiveReturn(entry, category, options);
    return Object.assign({}, entry, {
      card: card,
      category: resolveCategory(category, options && options.categoryAliases),
      multiplier: multiplier,
      returnCpp: returnCpp
    });
  }

  function whichCard(cardEntries, category, options) {
    options = options || {};
    var ranked = (Array.isArray(cardEntries) ? cardEntries : [])
      .map(function (entry) { return normalizeRankedEntry(entry, category, options); })
      .sort(sortRanked);

    return {
      category: resolveCategory(category, options.categoryAliases),
      best: ranked[0] || null,
      runnerUp: ranked[1] || null,
      ranked: ranked
    };
  }

  function gapAnalysis(cardEntries, category, amount, options) {
    if (amount && typeof amount === 'object' && !options) {
      options = amount;
      amount = options.amount;
    }
    options = options || {};
    var spendAmount = Number(amount);
    if (!isFinite(spendAmount) || spendAmount < 0) spendAmount = 0;
    var result = whichCard(cardEntries, category, options);
    var bestReturn = result.best ? result.best.returnCpp : 0;

    return result.ranked.map(function (entry) {
      var gapCpp = result.best ? round(bestReturn - entry.returnCpp, 2) : 0;
      var barPercent = bestReturn > 0 ? round(entry.returnCpp / bestReturn * 100, 1) : 0;
      return Object.assign({}, entry, {
        gapCpp: gapCpp,
        gapPercent: bestReturn > 0 ? round(gapCpp / bestReturn * 100, 1) : 0,
        barPercent: barPercent,
        missedValue: round(spendAmount * gapCpp / 100, 2)
      });
    });
  }

  window.WalletEngine = {
    resolveCategory: resolveCategory,
    getCurrentQuarter: getCurrentQuarter,
    getEffectiveMultiplier: getEffectiveMultiplier,
    effectiveReturn: effectiveReturn,
    whichCard: whichCard,
    gapAnalysis: gapAnalysis
  };
})();
