const root = document.documentElement;
const currentTheme = localStorage.getItem("theme");

if (currentTheme == "dark") {
  root.className = 'dark';
}

window.onload = function () {

  const darkmoder = document.getElementById("darkmoder");

  if (currentTheme == "dark") {
    darkmoder.setAttribute('mode', 'dark');
  } else {
    darkmoder.setAttribute('mode', 'light');
  }

  darkmoder.addEventListener("click", swapTheme, false);

}

function swapTheme() {
  if (darkmoder.getAttribute('mode') === 'dark') {
    darkmoder.setAttribute('mode', 'light');
    root.classList.remove('dark');
    var theme = "light";
  }
  else {
    darkmoder.setAttribute('mode', 'dark');
    root.className = 'dark';
    var theme = "dark";
  }

  localStorage.setItem("theme", theme);
}
