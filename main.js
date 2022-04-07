function ToggleDarkMode() {
   var element = document.body;
   element.classList.toggle("dark-mode");
}

function AddQedSymbols() {
   var els = document.getElementsByTagName("qed");
   for(var i = 0; i < els.length; i++) {
      var x = els[i];
      x.insertAdjacentHTML('afterbegin', '❖');
   }
}

 function ToggleFont() {
    var element = document.body;
    element.classList.toggle("change-font");
 }
