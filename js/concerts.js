let cont = document.getElementById('concerts_c');
cont.className = 'fade';
document.addEventListener("DOMContentLoaded", () => {
  window.setTimeout(function() {
    cont.classList.remove('fade');
  }, 230);
});

let menu0 = document.getElementById('menu2');

var checkbox0 = document.getElementById('check2');

var barras = document.getElementById('barras2');

checkbox0.addEventListener('change', function() {
  if (this.checked) {
    menu0.style.height = "100%";
    menu0.style.backgroundColor = "rgba(0, 0, 0, 0.92)";
    barras.src = "../res/close.png";
  } else {
    menu0.style.height = "fit-content";
    menu0.style.backgroundColor = "rgba(0, 0, 0, 0)";
    barras.src = "../res/menu.png";
  }
});


