// ==UserScript==
// @name        Void: Collect Pulls
// @description Collect pull requests to an input box. Can be used with the merge-pr script.
// @namespace   void
// @include     https://github.com/*
// @version     1
// @grant       none
// ==/UserScript==

function update() {
  let input = document.getElementById('_void_pull_textbox');
  if(!input) {
    input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'absolute';
    input.style.margin = '-3px 20px';
    input.style.width = '400px';
    input.onfocus = x => x.target.select();
    input.readonly = true;
    input.id = '_void_pull_textbox';
    const parent = document.querySelector('#js-issues-toolbar span.pl-3');
    if(!parent)
      return;
    parent.appendChild(input);
  }
  const checkboxes = Array.from(document.querySelectorAll("input[name='issues[]'][type='checkbox']"))
  input.value = checkboxes.filter(x => x.checked).map(x => x.value).join(" ");
}

document.body.addEventListener('change', update);
