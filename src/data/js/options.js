const browserInterface = typeof chrome !== 'undefined' ? chrome : browser;

const options = {
  custom_url: {
    attr: 'value',
    def: ''
  },
  clearWhitespace: {
    attr: 'checked',
    def: false
  },
  pwp_expire_after_days: {
    attr: 'value',
    def: 7
  },
  pwp_expire_after_views: {
    attr: 'value',
    def: 1
  },
  pwp_deletable_by_viewer: {
    attr: 'checked',
    def: true
  },
  pwp_retrieval_step: {
    attr: 'checked',
    def: true
  }
}
let savedTimeout; // Hide saved indicator after a bit.


function init() {
  // Initialize i18n.
  document.querySelectorAll('[data-i18n]').forEach(node => {
    node.textContent = browserInterface.i18n.getMessage(node.dataset.i18n);
  });

  // Restore settings.
  const getPrefs = browserInterface.storage.local.get('prefs');
  
  // Handle both Promise (Firefox) and chrome.storage.StorageArea (Chrome) cases
  if (getPrefs instanceof Promise) {
    getPrefs.then(handlePrefs);
  } else {
    getPrefs(handlePrefs);
  }
}

function handlePrefs(res) {
  let currentPrefs = res['prefs'] || {};
  Object.keys(options).forEach(id => {
    let val = (typeof currentPrefs[id] !== 'undefined') ? currentPrefs[id] : options[id].def;
    document.getElementById(id)[options[id].attr] = val;
  });
}

function saveOptions(e) {
  e.preventDefault();

  let toSave = {prefs: {}};
  Object.keys(options).forEach(id => {
    toSave['prefs'][id] = document.getElementById(id)[options[id].attr];
  });

  const saveOperation = browserInterface.storage.local.set(toSave);

  // Handle both Promise (Firefox) and chrome.storage.StorageArea (Chrome) cases
  function handleSaved() {
    let saved = document.querySelector('#saved');
    saved.style.display = 'block';

    if (savedTimeout) {
      clearTimeout(savedTimeout);
    }
    savedTimeout = setTimeout(() => {
      saved.style.display = 'none';
      savedTimeout = null;
    }, 3000);
  }

  if (saveOperation instanceof Promise) {
    saveOperation.then(handleSaved);
  } else {
    saveOperation(handleSaved);
  }
}

document.addEventListener('DOMContentLoaded', init);
document.querySelector('form').addEventListener('submit', saveOptions);
