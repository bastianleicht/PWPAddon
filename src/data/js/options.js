var browserInterface;
if (typeof chrome.app !== 'undefined') {
  console.log("We are running on Chrome!");
  browserInterface = chrome;
} else {
  console.log("We are running on Firefox!");
  browserInterface = browser;
}

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
  browserInterface.storage.local.get('prefs').then(res => {
    let currentPrefs = res['prefs'] || {};
    Object.keys(options).forEach(id => {
      console.log("save");
      console.log(options)
      console.log(id, options[id].attr, document.getElementById(id)[options[id].attr]);
      let val = (typeof currentPrefs[id] !== 'undefined') ? currentPrefs[id] : options[id].def;
      console.log(id, options[id].attr, val);
      document.getElementById(id)[options[id].attr] = val;
    });
  });
}

function saveOptions(e) {
  e.preventDefault();

  let toSave = {prefs: {}};
  Object.keys(options).forEach(id => {
    console.log("save");
    console.log(options)
    console.log(id, options[id].attr, document.getElementById(id)[options[id].attr]);
    toSave['prefs'][id] = document.getElementById(id)[options[id].attr];
  });
  browserInterface.storage.local.set(toSave).then(() => {
    // Indicate that we saved succesfully.
    let saved = document.querySelector('#saved');

    saved.style.display = 'block';

    if (savedTimeout) {
      clearTimeout(savedTimeout);
    }
    savedTimeout = setTimeout(() => {
      saved.style.display = 'none';
      savedTimeout = null;
    }, 3000)
  });
}

document.addEventListener('DOMContentLoaded', init);
document.querySelector('form').addEventListener('submit', saveOptions);
