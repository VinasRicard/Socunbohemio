let menu0 = document.getElementById('menu2');

var checkbox0 = document.getElementById('check2');

checkbox0.addEventListener('change', function() {
  if (this.checked) {
    menu0.style.height = "100%";
    menu0.style.backgroundColor = "rgba(0, 0, 0, 0.92)";
  } else {
    menu0.style.height = "fit-content";
    menu0.style.backgroundColor = "rgba(0, 0, 0, 0)";
  }
});
