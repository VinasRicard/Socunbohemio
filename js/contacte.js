let menu0 = document.getElementById('menu3');

var checkbox0 = document.getElementById('check3');

checkbox0.addEventListener('change', function() {
  if (this.checked) {
    menu0.style.height = "100%";
    menu0.style.backgroundColor = "rgba(0, 0, 0, 0.92)";
  } else {
    menu0.style.height = "fit-content";
    menu0.style.backgroundColor = "rgba(0, 0, 0, 0)";
  }
});

let back = document.getElementById('op3');
var win = window;
var doc = document;
body = doc.getElementsByTagName('body')[0];
back.style.height = x = win.innerWidth || docElem.clientWidth || body.clientWidth;
back.style.width = y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
