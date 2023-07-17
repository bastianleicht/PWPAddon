import processPassword from './shortener.js';

const _ = browser.i18n.getMessage;

/**
 * Execute content script to discover canonical short URL on current tab,
 * then listen to it being returned via message.
 */
export default function discoverSelectedContent() {
  browser.storage.local.get('prefs').then(ret => {
    const prefs = ret['prefs'] || {};

    // Do not investigate special cases if preffed off.
    if (prefs.use_special === false) {
      return 'default';
    }

    browser.tabs.executeScript( {
      code: "window.getSelection().toString();"
    }, function(selection) {
      console.log("selection", selection);
      processPassword(selection[0])
    });
  });
}
