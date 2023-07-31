import discoverSelectedContent from "./discover.js";
export const pwpNotification = "pwp-notification";

const _ = browser.i18n.getMessage;

console.log("loaded extensions");

/** Add context menus and toolbar button. */
// per-page
browser.contextMenus.create({
  id: 'shorten-page',
  title: _('menuitem_label'),
  contexts: ['page', 'tab', 'selection']
});


/** Process content menu clicks */
browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
  case 'shorten-page':
    processPassword(info.selectionText);
    break;
  }
});

/** Listen to keyboard shortcut. */
browser.commands.onCommand.addListener((cmd) => {
  if (cmd === 'shorten-page-url') {
    discoverSelectedContent();
  }
});

browser.browserAction.onClicked.addListener(() => {
  const clearing = browser.notifications.clear(pwpNotification);
  clearing.then(() => {
    console.log("cleared");
  });
});
