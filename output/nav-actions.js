(function () {
  'use strict';

  var STORAGE_KEY = 'churn_data';
  var LEGACY_STORAGE_KEY = 'osaka_data';
  var PREFS_KEY = 'valueAdvisorPrefs';
  var HOUSEHOLD_KEY = 'churn_household';
  var LEGACY_HOUSEHOLD_KEY = 'osaka_household';
  var THEME_KEY = 'churn-theme';

  function readJson(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function readRewardsData() {
    return readJson(STORAGE_KEY) || readJson(LEGACY_STORAGE_KEY) || { _version: 3, accounts: [], benefits: [], profile: {} };
  }

  function readHouseholdData() {
    return readJson(HOUSEHOLD_KEY) || readJson(LEGACY_HOUSEHOLD_KEY) || [];
  }

  function getProgramNameBySlug(slug) {
    if (!slug || !window.PROGRAMS || !window.PROGRAMS.programs) return null;
    var names = Object.keys(window.PROGRAMS.programs);
    for (var index = 0; index < names.length; index += 1) {
      if (window.PROGRAMS.programs[names[index]].slug === slug) return names[index];
    }
    return null;
  }

  function getProgramForAccount(account) {
    if (!account || !window.PROGRAMS || !window.PROGRAMS.programs) return null;
    if (account.programSlug) {
      var bySlug = getProgramNameBySlug(account.programSlug);
      if (bySlug) return window.PROGRAMS.programs[bySlug];
    }
    if (account.program && window.PROGRAMS.programs[account.program]) {
      return window.PROGRAMS.programs[account.program];
    }
    return null;
  }

  function getStaleness(account) {
    var program = getProgramForAccount(account);
    var type = program ? program.type : (account && account.type) || 'other';
    var freshDays = (type === 'airline' || type === 'hotel') ? 14 : 30;
    var agingDays = (type === 'airline' || type === 'hotel') ? 30 : 60;
    if (!account || !account.lastUpdated) return { level: 'stale' };
    var date = new Date(account.lastUpdated);
    if (isNaN(date.getTime())) return { level: 'stale' };
    var days = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (days < freshDays) return { level: 'fresh' };
    if (days < agingDays) return { level: 'aging' };
    return { level: 'stale' };
  }

  function countStale(data) {
    var stale = 0;
    var aging = 0;
    var accounts = data && Array.isArray(data.accounts) ? data.accounts : [];
    accounts.forEach(function (account) {
      var state = getStaleness(account);
      if (state.level === 'stale') stale += 1;
      else if (state.level === 'aging') aging += 1;
    });
    return { stale: stale, aging: aging, needsRefresh: stale + aging };
  }

  function updateRefreshButtonState() {
    var button = document.getElementById('nav-refresh-btn');
    if (!button) return;
    var counts = countStale(readRewardsData());
    if (counts.needsRefresh > 0) {
      button.classList.add('has-stale');
      button.title = counts.needsRefresh + ' balance' + (counts.needsRefresh === 1 ? '' : 's') + ' need' + (counts.needsRefresh === 1 ? 's' : '') + ' refresh';
      button.setAttribute('aria-label', button.title);
      return;
    }
    button.classList.remove('has-stale');
    button.title = 'All balances are current';
    button.setAttribute('aria-label', 'Refresh balances');
  }

  function exportData() {
    var backup = readRewardsData();
    backup.valueAdvisorPrefs = readJson(PREFS_KEY);
    backup.churn_household = readHouseholdData();
    var blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'churn-backup-' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function initThemeToggle() {
    var html = document.documentElement;
    var button = document.getElementById('theme-toggle');

    function applyTheme(theme) {
      if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        html.style.colorScheme = 'dark';
        if (button) button.textContent = '\u2600';
      } else {
        html.removeAttribute('data-theme');
        html.style.colorScheme = 'light';
        if (button) button.textContent = '\u263E';
      }
    }

    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (error) {}
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    }

    if (button) {
      button.addEventListener('click', function () {
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (error) {}
      });
    }
  }

  function initStandaloneNav() {
    var refreshButton = document.getElementById('nav-refresh-btn');
    var exportButton = document.getElementById('nav-export-btn');

    if (refreshButton) {
      refreshButton.addEventListener('click', function () {
        window.location.href = 'index.html#refresh';
      });
    }

    if (exportButton) {
      exportButton.addEventListener('click', exportData);
    }

    initThemeToggle();
    updateRefreshButtonState();

    window.addEventListener('storage', function (event) {
      if (!event.key || event.key === STORAGE_KEY || event.key === LEGACY_STORAGE_KEY) {
        updateRefreshButtonState();
      }
    });
  }

  window.ChurnNavActions = {
    initStandaloneNav: initStandaloneNav,
    updateRefreshButtonState: updateRefreshButtonState,
    exportData: exportData
  };
})();
