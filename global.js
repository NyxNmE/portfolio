console.log("IT'S ALIVE!");

export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = location.pathname.endsWith("index.html") || location.pathname === "/";

const pages = [
  { url: ARE_WE_HOME ? "index.html" : "../index.html", title: "Home" },
  { url: ARE_WE_HOME ? "projects/index.html" : "../projects/index.html", title: "Projects" },
  { url: ARE_WE_HOME ? "contact/index.html" : "../contact/index.html", title: "Contact" },
  { url: ARE_WE_HOME ? "resume/index.html" : "../resume/index.html", title: "Resume" },
  { url: "https://github.com/NyxNmE", title: "GitHub" }
];

const nav = document.createElement("nav");
const navLinks = document.createElement("div");
navLinks.classList.add("nav-links");

pages.forEach((page) => {
  const a = document.createElement("a");
  a.href = page.url;
  a.textContent = page.title;
  
  if (page.url.startsWith("http")) {
    a.target = "_blank";
  }
  
  if (location.pathname.includes(page.url.replace("index.html", ""))) {
    a.classList.add("current");
  }
  
  navLinks.appendChild(a);
});

nav.appendChild(navLinks);

const themeLabel = document.createElement("label");
themeLabel.classList.add("color-scheme");
themeLabel.innerHTML = `
  Theme:
  <select id="theme-switcher">
    <option value="light dark" selected>Automatic</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
`;

nav.appendChild(themeLabel);

document.body.prepend(nav);

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
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching or parsing JSON data:", error);
    return [];
  }
}

export async function fetchGithubData(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching GitHub API data:", error);
    return null;
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!containerElement) {
    console.error("Container element is missing or invalid.");
    return;
  }
  containerElement.innerHTML = '';

  if (!Array.isArray(projects) || projects.length === 0) {
    containerElement.innerHTML = `<p>No projects found.</p>`;
    return;
  }

  projects.forEach((project) => {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    containerElement.appendChild(article);
  });

  const projectTitleElement = document.querySelector('.projects-title');
  if (projectTitleElement) {
    projectTitleElement.textContent = `${projects.length} Projects`;
  }
}
