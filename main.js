function show_hide(id) {
  var x = document.getElementById(id);
  if (x.style.display === "none") {
    x.style.display = "inline";
  } else {
    x.style.display = "none";
  }
}

function dark_light_button_fn() {
  var url = window.location.href.split('?')[0];
  var y = document.getElementById('dark_mode');
  if (y.innerHTML==="dark mode")
    url = url + "?dark=true";
  window.location = url;

}

function toggle_dark_mode() {
  var x = document.body;
  x.classList.toggle("dark");
  var buttons = document.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
      let button = buttons[i];
      button.classList.toggle("dark")
  }
  var y = document.getElementById('dark_mode');
  if (y.innerHTML==="light mode")
    y.innerHTML="dark mode";
  else
    y.innerHTML="light mode";
}

function automatic_dark_mode()
{
  let searchParams = new URLSearchParams(window.location.search);
  if(searchParams.has('dark') && searchParams.get('dark')==="true")
    toggle_dark_mode();
}

function mode_link(url)
{
  var y = document.getElementById('dark_mode');
  if (y.innerHTML==="dark mode")
    url = url + "?dark=true";
  window.location = url;
}
