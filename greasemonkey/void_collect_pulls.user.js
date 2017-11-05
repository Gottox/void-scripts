// ==UserScript==
// @name        void_collect_pulls
// @namespace   void
// @include     https://github.com/*/void-packages/pulls*
// @version     1
// @grant       none
// ==/UserScript==

const checkboxes = Array.from(document.querySelectorAll("input[name='issues[]'][type='checkbox']"))
const input = document.createElement('input');
input.type = 'text';
input.style.position = 'absolute';
input.style.margin = '-3px 20px';
input.style.width = '400px';
input.onfocus = x => x.target.select();
input.readonly = true;
document.querySelector('#js-issues-toolbar span.pl-3').appendChild(input);

checkboxes.forEach(x => {
  addEventListener('change', ev => {
    update();
    return false;
  });
  
})

function update() {
  input.value = checkboxes.filter(x => x.checked).map(x => x.value).join(" ");
}
