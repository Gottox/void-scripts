// ==UserScript==
// @name        Void: Buildbot Scrolldown
// @description Automaticly scrolls down on buildbot output
// @namespace   void
// @include     https://build.voidlinux.eu/builders/*/builds/*/steps/*/logs/stdio
// @version     1
// @grant       none
// @run-at      document-start
// ==/UserScript==

let timeout = -1;
let finished = false;
let ignoreNext = false;

const E = document.scrollingElement
E.style.paddingBottom = '20px';

function doScroll() {
  if(finished)
    return;
  E.style.background = "#ffa";


  ignoreNext = true;
  timeout = setTimeout(doScroll, 500);
  window.scrollTo(0, E.scrollHeight);
}
function clearScroll() {
  E.style.background = "";
  window.clearTimeout(timeout);
  timeout = -1;
}

// wait 3 seconds so we are sure, the page isn't already finished
timeout = setTimeout(doScroll, 3000);

document.addEventListener("DOMContentLoaded", e => {
  finished = true;
  clearScroll();
});

document.addEventListener("scroll", e => {
  if(ignoreNext)
    return ignoreNext = false;
  if (E.scrollHeight - E.clientHeight - e.pageY === 0 && timeout === -1) {
    doScroll();
  } else if(timeout !== -1) {
    clearScroll();
  }
});
