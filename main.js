// DARK AND LIGHT MODE CODE

function get_dark_and_light_mode_status() {
  var light_switch_button = document.getElementById('light_switch_button');
  return light_switch_button.innerHTML;
}

function set_dark_and_light_mode_status(status) {
  var light_switch_button = document.getElementById('light_switch_button');
  light_switch_button.innerHTML = status;
}

function get_background_color_text_color_and_inverse_mode(mode) {
  if (mode==="light mode")
    return ["white","black","dark mode"];
  return ["black","white","light mode"];
}

function toggle_dark_and_light_modes() {
  var new_mode = get_dark_and_light_mode_status();
  x = get_background_color_text_color_and_inverse_mode(new_mode);
  document.body.style.backgroundColor = x[0];
  document.body.style.color = x[1];
  set_dark_and_light_mode_status(x[2]);
}

// SHOW AND HIDE DIVS CODE
function show_element_by_id(id) {
  var elmn = document.getElementById(id);
  elmn.style.display = "inline";
}

function show_only_page(page_id) {
  var divsToHide = document.getElementsByClassName("page");
    for(var i = 0; i < divsToHide.length; i++){
        divsToHide[i].style.display = "none";
    }
  show_element_by_id(page_id);
}

function show_only_topic(topic_id) {
  var divsToHide = document.getElementsByClassName("topic");
    for(var i = 0; i < divsToHide.length; i++){
        divsToHide[i].style.display = "none";
    }
  show_element_by_id(topic_id);
}

function toggle_show_and_hide(id) {
  var x = document.getElementById(id);
  if (x.style.display === "none")
    x.style.display = "inline";
  else
    x.style.display = "none";
}
