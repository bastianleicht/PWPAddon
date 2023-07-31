import processPassword from "./shortener.js";

var browserInterface;
if (typeof chrome.app !== 'undefined') {
  console.log("We are running on Chrome!");
  browserInterface = chrome;
} else {
  console.log("We are running on Firefox!");
  browserInterface = browser;
}

export const pwpNotification = "pwp-notification";

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
