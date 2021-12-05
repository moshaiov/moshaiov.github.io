function show_hide(id) {
  var x = document.getElementById(id);
  if (x.style.display === "none") {
    x.style.display = "inline";
  } else {
    x.style.display = "none";
  }
}

function toggle_dark_mode() {
  var y = document.getElementById('dark_mode');
  if (y.innerHTML==="light mode") {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    y.innerHTML="dark mode";
  }
  else {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    y.innerHTML="light mode";
  }
  var buttons = document.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
      let button = buttons[i];
      button.classList.toggle("dark")
  }
}

function dark_light_button_fn() {
  toggle_dark_mode();
}

function automatic_dark_mode()
{
  let searchParams = new URLSearchParams(window.location.search);
  if(searchParams.get('dark')==="true")
    toggle_dark_mode();
}

function mode_link(url)
{
  var y = document.getElementById('dark_mode');
  if (y.innerHTML==="light mode")
    url = url + "?dark=true";
  window.location = url;
}
