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

document.scrollingElement.style.paddingBottom = '20px';

function doScroll() {
  if(finished)
    return;
  const b = document.body;
  b.style.background = "linear-gradient(to bottom, rgba(125,185,232,0) 80%,rgba(125,185,232,1) 100%) fixed";


  ignoreNext = true;
  timeout = setTimeout(doScroll, 500);
  window.scrollTo(0, document.scrollingElement.scrollHeight);
}
function clearScroll() {
  document.body.style.background = "";
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
  const b = document.scrollingElement;
  if (document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight - e.pageY === 0 && timeout === -1) {
    doScroll();
  } else if(timeout !== -1) {
    clearScroll();
  }
});
