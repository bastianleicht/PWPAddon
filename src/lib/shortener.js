const _ = browser.i18n.getMessage;

// Service default.
const DEFAULT_SERVICE = 'pwpush_com';

// Specify 'url' for plain-text GET APIs, or request/result for more complex
// variants. Note: return a fetch() promise.
// Do not forget to add origins to permissions in manifest.
const serviceUrls = {
  none: {}, // Placeholder.

  pwpush_com: {
    full_url: 'https://pwpush.com/p/',
    request: password => {
      const ret = browser.storage.local.get('prefs');
      const prefs = ret['prefs'] || {};

      let form = new FormData();
      form.append('password[payload]', password);
      form.append('password[expire_after_days]', prefs.pwp_expire_after_days);  // Expire secret link and delete after this many days.
      form.append('password[expire_after_views]', prefs.pwp_expire_after_views);  // Expire secret link and delete after this many views.
      form.append('password[deletable_by_viewer]', prefs.pwp_deletable_by_viewer);  // Allow users to delete passwords once retrieved.
      form.append('password[retrieval_step]', prefs.pwp_retrieval_step);  // Helps to avoid chat systems and URL scanners from eating up views.

      return fetch('https://pwpush.com/p.json', {
        method: 'POST',
        body: form
      });
    },
    result: async response => {
      const res = await response.json();
      return res['url_token'];
    },
  },

  custom: {
    request: password => {
      const ret = browser.storage.local.get('prefs');
      const prefs = ret['prefs'] || {};

      let form = new FormData();
      form.append('password[payload]', password);
      form.append('password[expire_after_days]', 10);  // Needed?
      return fetch(prefs.custom_url + '/p.json', {
        method: 'POST',
        body: form
      });
    },
    result: async response => {
      const res = await response.json();
      return res['url_token'];
    },
  },

  /** Special services: Cannot be chosen manually. **/
  // Note: No special services implemented at this time after git.io shut down.
}


/** Create a short URL from is.gd, tinyurl, etc. */

function createPWPLink(password, force_service) {
  let req;

  try {
    // Get shortening service from prefs.
    return browser.storage.local.get('prefs').then(ret => {
      const prefs = ret['prefs'] || {};
      let service;

      // Hardcoded special-cased websites can enforce a shortening service.
      if (prefs.service !== 'none' && force_service) {
        service = serviceUrls[force_service];
      } else {
        switch (prefs.service) {
          case 'custom':
            service = { url: prefs.custom_url };
            break;
          default:
            service = serviceUrls[prefs.service];
            service ||= serviceUrls[DEFAULT_SERVICE];  // Fallback to default.
            break;
        }
      }

      req = service.request(password);

      return req.then(response => {
        if (response.ok) {
          let result = service.result ? service.result(response) : response.text();
          console.log('createPWPLink', result)
          return result;
        } else {
          throw new Error(_('fetch_error'));
        }
      });

    }).catch(err => {
      console.log(err.message);
      throw new Error(_('fetch_error'));
    });

  } catch (e) {
    notify(e.message);
    return false;
  }
}


/** Finalize (notify and copy to clipboard) a detected or generated URL. */
async function finalizeUrl(result, force_service) {
  console.log('finalizeUrl', result)

  browser.storage.local.get('prefs').then(async ret => {
    const prefs = ret['prefs'] || {};
    let copyText;
    let service;

    // Hardcoded special-cased websites can enforce a shortening service.
    if (prefs.service !== 'none' && force_service) {
      service = serviceUrls[force_service];
    } else {
      switch (prefs.service) {
        case 'custom':
          service = { url: prefs.custom_url };
          break;
        default:
          service = serviceUrls[prefs.service];
          service ||= serviceUrls[DEFAULT_SERVICE];  // Fallback to default.
          break;
      }
    }

    copyText = service.full_url + result;

    navigator.clipboard.writeText(copyText);
  });
}


/** Handle a URL found on the page */
export default function processPassword(selected_password) {
  console.log("selected_password", selected_password);

  browser.storage.local.get('prefs').then(ret => {
    const prefs = ret['prefs'] || {};

    if(prefs.clearWhitespace === true) {
      // Remove whitespace from final URL.
      selected_password = selected_password.trim();
    }

    createPWPLink(selected_password, prefs.service).then(result => finalizeUrl(result, prefs.service));
  });
}
