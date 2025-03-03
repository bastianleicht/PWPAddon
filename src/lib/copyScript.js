const browserAPI = typeof chrome !== 'undefined' ? chrome : browser;

// https://stackoverflow.com/a/71336017
browserAPI.runtime.onMessage.addListener( // this is the message listener
    function(request, sender, sendResponse) {
        if (request.message === "PWPcopyText")
            copyToTheClipboard(request.textToCopy);
    }
);

async function copyToTheClipboard(textToCopy){
    const el = document.createElement('textarea');
    el.value = textToCopy;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}