// ==UserScript==
// @name        Void: auto choose pull method
// @description More then 2 commits -> merge; else rebase
// @namespace   void
// @include     https://github.com/voidlinux/void-packages/pull/*
// @version     1
// @grant       none
// ==/UserScript==

window.addEventListener("load", () => {
  document.querySelector(".merge-message button ~ button").click();
  const commitCount = +document.getElementById("commits_tab_counter").innerText;
  const commentCount = +document.getElementById("conversation_tab_counter").innerText;
  
  setTimeout(() => {
    const pulltypes = document.querySelectorAll(".merge-message .select-menu-modal-holder .select-menu-item");
    if(pulltypes.length != 3)
      return alert("Must be three pulltypes!");
    for(let x of pulltypes) {
      const l = x.innerText.split('\n')[0].toLowerCase();
      if(l.includes("rebase") && commitCount <= 3)
        return x.click();
      else if(l.includes("merge") && commitCount > 3)
        return x.click();
    }
  }, 20);
});
