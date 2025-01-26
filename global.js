console.log("IT'S ALIVE!");

export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const navLinks = $$("nav a");
const currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname
);
if (currentLink) {
  currentLink.classList.add("current");
}

document.body.insertAdjacentHTML(
  "afterbegin",
  `
    <label class="color-scheme">
      Theme:
      <select id="theme-select">
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  `
);

const select = document.querySelector("#theme-select");

function setColorScheme(mode) {
  document.documentElement.style.setProperty("color-scheme", mode);
  localStorage.colorScheme = mode;
}

if (localStorage.colorScheme) {
  setColorScheme(localStorage.colorScheme);
  select.value = localStorage.colorScheme;
}

select.addEventListener("input", (event) => {
  const mode = event.target.value;  
  setColorScheme(mode);
  console.log("color scheme changed to", mode);
});
