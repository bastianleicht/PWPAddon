import discoverUrl from './discover.js';
import processPassword from './shortener.js';
import discoverSelectedContent from "./discover.js";

const _ = browser.i18n.getMessage;

console.log("loaded extensions");

/** Add context menus and toolbar button. */
// per-page
browser.contextMenus.create({
  id: 'shorten-page',
  title: _('menuitem_label'),
  contexts: ['page', 'tab', 'selection']
});

// Toolbar button.
browser.browserAction.onClicked.addListener(discoverUrl);


/** Process content menu clicks */
browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
  case 'shorten-page':
    discoverSelectedContent();
    break;
  }
});

/** Listen to keyboard shortcut. */
browser.commands.onCommand.addListener((cmd) => {
  if (cmd === 'shorten-page-url') {
    discoverUrl();
  }
});
