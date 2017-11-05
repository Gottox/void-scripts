// ==UserScript==
// @name        Void: Update Checkboxes
// @description Inserts Checkboxes to void-updates. Poor mans To-Do list.
// @namespace   void
// @include     https://repo.voidlinux.eu/void-updates/void-updates.txt
// @version     1
// @grant       none
// ==/UserScript==
const e = document.body.getElementsByTagName("pre")[0];
const d = new Date().toDateString();
const runId = e.innerText.split("\n",2)[0].innerText;
const now = new Date().getTime();
const twoWeeks = 1000 * 2 * 7 * 24 * 60 * 60;

if(localStorage.$runId != runId) {
	localStorage.clear();
	localStorage.$runId = runId;
}
e.innerHTML="<style>.old { color: red; } :checked,:checked ~ label { opacity: 0.2; }</style>"+e.innerHTML.replace(/^(\S+) +(\S+) [^ ]+ ([^ ]+) +(([^ ]+) +|)([^ \n]*)$/gm,
	(all, name, oVer, nVer, date) => {
	  date = new Date(date.trim()).getTime();
		const id=name+"-"+nVer;
		const cls= isNaN(date) || now - date > twoWeeks ? 'old' : '';
		return `<span class='${cls}'><input type='checkbox' onclick='localStorage[this.id]=~~this.checked' id=${id} ${localStorage[id]==1 ? "checked" : ""}> <label for=${id}>${all}</label></span>`;
	});

