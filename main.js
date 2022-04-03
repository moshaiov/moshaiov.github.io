function ToggleDarkMode() {
   var element = document.body;
   element.classList.toggle("dark-mode");
}

function AddQedSymbols() {
   console.log("hi");
   var els = document.getElementsByTagName("qed");
   for(var i = 0; i < els.length; i++) {
      console.log("hi");
      var x = els[i];
      x.insertAdjacentHTML('afterbegin', '❖');
   }
}
