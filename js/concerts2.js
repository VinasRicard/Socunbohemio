let page = document.getElementById('block1');
page.className = 'fade';
document.addEventListener("DOMContentLoaded", () => {
  window.setTimeout(function() {
    page.classList.remove('fade');
  }, 230);
});

let page2 = document.getElementById('block2');
page.className = 'fade';
document.addEventListener("DOMContentLoaded", () => {
  window.setTimeout(function() {
    page2.classList.remove('fade');
  }, 230);
});

let menu0 = document.getElementById('menu7');

var checkbox0 = document.getElementById('check4');

let lletres = document.getElementById('lletres');

var barras = document.getElementById('barras4');

checkbox0.addEventListener('change', function() {
  if (this.checked) {
    menu0.style.height = "2000px";
    menu0.style.backgroundColor = "rgba(0, 0, 0, 0.92)";
    lletres.style.overflowY = "hidden";
    barras.src = "../res/close.png";
  } else {
    menu0.style.height = "fit-content";
    menu0.style.backgroundColor = "rgba(0, 0, 0, 0)";
    barras.src = "../res/menu.png";
  }
});
