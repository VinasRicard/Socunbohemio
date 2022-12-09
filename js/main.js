let menu0 = document.getElementById('menu0');

var checkbox0 = document.getElementById('check0');

var barras = document.getElementById('barras0');

checkbox0.addEventListener('change', function() {
  if (this.checked) {
    menu0.style.height = "100%";
    menu0.style.backgroundColor = "rgba(0, 0, 0, 0.92)";
    barras.src = "res/close.png";
  } else {
    menu0.style.height = "fit-content";
    menu0.style.backgroundColor = "rgba(0, 0, 0, 0)";
    barras.src = "res/menu.png";
  }
});
