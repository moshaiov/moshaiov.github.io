function show_hide(id) {
  var x = document.getElementById(id);
  if (x.style.display === "none") {
    x.style.display = "inline";
  } else {
    x.style.display = "none";
  }
}

function dark_mode() {
  var x = document.body;
  x.classList.toggle("dark");
  var buttons = document.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
      let button = buttons[i];
      button.classList.toggle("dark")
  }
  var hrs = document.getElementsByTagName('hr');
  for (let i = 0; i < hrs.length; i++) {
      let hr = hrs[i];
      hr.classList.toggle("dark")
  }
  var y = document.getElementById('dark_mode');
  if (y.innerHTML==="light mode")
  {
    y.innerHTML="dark mode";
    localStorage.setItem('dark',"off");
  }
  else
  {
    y.innerHTML="light mode";
    localStorage.setItem('dark',"on");
  }
}

function mode_guesser() {
  console.log(localStorage.getItem('dark'))
}

function automatic_dark_mode()
{
  if(localStorage.getItem('dark')==="on")
    dark_mode();
}
