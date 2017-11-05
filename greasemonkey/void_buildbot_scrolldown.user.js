// ==UserScript==
// @name        Void: Buildbot Scrolldown
// @description Automaticly scrolls down on buildbot output
// @namespace   void
// @include     https://build.voidlinux.eu/builders/*/builds/*/steps/*/logs/stdio
// @version     1
// @grant       none
// @run-at      document-start
// ==/UserScript==

let timeout;

function doScroll() {
  window.scrollBy(0, 9999999);
  timeout = setTimeout(doScroll, 100);
}

// wait 3 seconds so we are sure, the page isn't already finished
timeout = setTimeout(doScroll, 3000);

document.addEventListener("DOMContentLoaded", e => {
    window.clearTimeout(timeout);
});
