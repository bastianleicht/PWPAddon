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

/** Listen to content scripts posting back after discovery */
browser.runtime.onMessage.addListener(msg => {
  // If specialty discoverer returns it did not find anything, apply default
  // discovery mechanism and listen again.
  if (!msg.url) {
    runDiscoveryScript('default');
  } else {
    //processPassword(msg);
  }
});
