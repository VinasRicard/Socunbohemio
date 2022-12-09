let menu0 = document.getElementById('menu4');

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
