var browserInterface;
if (typeof chrome.app !== 'undefined') {
  console.log("We are running on Chrome!");
  browserInterface = chrome;
} else {
  console.log("We are running on Firefox!");
  browserInterface = browser;
}

const pwpNotification = "pwp-notification";

const _ = browserInterface.i18n.getMessage;

console.log("loaded extensions");

/** Add context menus and toolbar button. */
browserInterface.runtime.onInstalled.addListener(function () {
  // per-page
  browserInterface.contextMenus.create({
    id: 'shorten-page',
    title: _('menuitem_label'),
    contexts: ['selection']
  });
});

/** Process content menu clicks */
browserInterface.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
  case 'shorten-page':
    processPassword(info.selectionText);
    break;
  }
});

/** Listen to keyboard shortcut. */
browserInterface.commands.onCommand.addListener((cmd) => {
  if (cmd === 'shorten-page-url') {
    discoverSelectedContent();
  }
});

browserInterface.browserAction.onClicked.addListener(() => {
  const clearing = browserInterface.notifications.clear(pwpNotification);
  clearing.then(() => {
    console.log("cleared");
  });
});


/** Push the password to the selected Service */
function createPWPLink(password) {
  let req;

  try {
    // Get shortening service from prefs.
    return browserInterface.storage.local.get('prefs').then(ret => {
      const prefs = ret['prefs'] || {};

      const url = prefs.custom_url || 'https://pwpush.com/';

      let form = new FormData();
      form.append('password[payload]', password);
      form.append('password[expire_after_days]', prefs.pwp_expire_after_days);  // Expire secret link and delete after this many days.
      form.append('password[expire_after_views]', prefs.pwp_expire_after_views);  // Expire secret link and delete after this many views.
      form.append('password[deletable_by_viewer]', prefs.pwp_deletable_by_viewer);  // Allow users to delete passwords once retrieved.
      form.append('password[retrieval_step]', prefs.pwp_retrieval_step);  // Helps to avoid chat systems and URL scanners from eating up views.

      req = fetch(url + '/p.json', {
        method: 'POST',
        body: form
      });

      return req.then(async response => {
        if (response.ok) {
          const res = await response.json();
          console.log('createPWPLink JSON', res)
          let result = res['url_token'];
          console.log('createPWPLink', result)
          return result;
        } else {
          notify(_('fetch_error'));
          console.error('createPWPLink_Error', response)
        }
      });

    }).catch(err => {
      console.log(err.message);
      notify(err.message);
      throw new Error(_('fetch_error'));
    });

  } catch (e) {
    notify(e.message);
    return false;
  }
}


/** Finalize (notify and copy to clipboard) a detected or generated URL. */
async function finalizeUrl(result) {
  console.log('finalizeUrl', result)

  browserInterface.storage.local.get('prefs').then(async ret => {
    const prefs = ret['prefs'] || {};
    let copyText;

    let full_url = prefs.custom_url || 'https://pwpush.com/';

    if(full_url[full_url.length - 1] === "/") {
      copyText = full_url + 'p/' + result;
    } else {
      copyText = full_url + '/p/' + result;
    }

    console.log('copyText', copyText)

    // Add retrieval step if enabled.
    if(prefs.pwp_retrieval_step === true) {
      copyText += '/r/';
    }

    navigator.clipboard.writeText(copyText);

    notify(_('copied_to_clipboard'));

  });
}


/** Handle a URL found on the page */
function processPassword(selected_password) {
  console.log("selected_password", selected_password);

  browserInterface.storage.local.get('prefs').then(ret => {
    const prefs = ret['prefs'] || {};

    if(prefs.clearWhitespace === true) {
      // Remove whitespace from final URL.
      selected_password = selected_password.trim();
    }

    createPWPLink(selected_password).then(result => finalizeUrl(result));
  });
}

function notify(message)
{
  browserInterface.notifications.create(pwpNotification, {
    "type": "basic",
    "title": "PWPush",
    "message": message,
    "priority": 2,
    "iconUrl": browser.runtime.getURL("data/img/icon-48.png"),
  });
}
