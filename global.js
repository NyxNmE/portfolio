console.log("IT'S ALIVE!");

export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains("home");

const pages = [
  { url: "",            title: "Home" },
  { url: "projects/",   title: "Projects" },
  { url: "contact/",    title: "Contact" },
  { url: "resume/",     title: "Resume" },
  { url: "https://github.com/NyxNmE", title: "GitHub" }
];

const nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let a = document.createElement("a");

  let finalURL = p.url;
  if (!ARE_WE_HOME && !finalURL.startsWith("http")) {
    finalURL = "../" + finalURL;
  }

  a.href = finalURL;
  a.textContent = p.title;

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }

  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.append(a);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select id="theme-switcher">
      <option value="light dark" selected>Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

const themeSwitcher = document.getElementById("theme-switcher");

themeSwitcher.addEventListener("change", (event) => {
  document.documentElement.style.colorScheme = event.target.value;
  localStorage.setItem("preferred-theme", event.target.value);
});

const savedTheme = localStorage.getItem("preferred-theme");
if (savedTheme) {
  themeSwitcher.value = savedTheme;
  document.documentElement.style.colorScheme = savedTheme;
}

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching or parsing JSON data:", error);
  }
}

async function loadProjects() {
  const projectsContainer = document.querySelector(".projects");

  if (!projectsContainer) return; 

  const projects = await fetchJSON("../lib/projects.json");
  if (!projects) return;

  projectsContainer.innerHTML = ""; 

  projects.forEach((project) => {
    const article = document.createElement("article");
    article.innerHTML = `
      <h2>${project.title}</h2>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    projectsContainer.appendChild(article);
  });
}

if (document.querySelector(".projects")) {
  loadProjects();
}
