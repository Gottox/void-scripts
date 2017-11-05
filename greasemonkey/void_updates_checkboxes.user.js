// ==UserScript==
// @name        void_updates_checkboxes
// @namespace   void
// @include     https://repo.voidlinux.eu/void-updates/void-updates.txt
// @version     1
// @grant       none
// ==/UserScript==
var e = document.body.getElementsByTagName("pre")[0];
var d = new Date().toDateString();
var runId = e.innerText.split("\n",2)[0].innerText;
if(localStorage.$runId != runId) {
	localStorage.clear();
	localStorage.$runId = runId;
}
e.innerHTML="<style>.old { color: red; } :checked,:checked ~ label { opacity: 0.2; }</style>"+e.innerHTML.replace(/^(\S+) +(\S+) [^ ]+ ([^ ]+) +(([^ ]+) +|)([^ ]*)$/gm,
	(all, name, oVer, nVer, date) => {
    var id=name+"-"+nVer;
	  var cls=new Date().getTime() - new Date(date).getTime() > 2 * 7 * 24 * 60 * 60 ? 'old' : '';
	  return "<span><input class='"+cls+"' type='checkbox' onclick='localStorage[this.id]=this.checked?1:0' id='"+id+"' " + (localStorage[id]==1 ? "checked>" : ">") + "<label for='"+id+"'>" + all +"</label></span>";
  });
