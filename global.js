console.log("IT'S ALIVE!");

export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const pages = [
  { url: "/portfolio/index.html", title: "Home" },
  { url: "/portfolio/projects/index.html", title: "Projects" },
  { url: "/portfolio/contact/index.html", title: "Contact" },
  { url: "/portfolio/resume/index.html", title: "Resume" },
  { url: "https://github.com/NyxNmE", title: "GitHub" }
];

const nav = document.createElement("nav");
document.body.prepend(nav);

pages.forEach(page => {
  const a = document.createElement("a");
  a.href = page.url;
  a.textContent = page.title;

  if (page.url.startsWith("http")) {
    a.target = "_blank";
  }

  if (window.location.pathname === page.url) {
    a.classList.add("current");
  }

  nav.appendChild(a);
});

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
      <p class="project-year"><em>c. ${project.year}</em></p>
    `;
    containerElement.appendChild(article);
  });

  const projectTitleElement = document.querySelector('.projects-title');
  if (projectTitleElement) {
    projectTitleElement.textContent = `${projects.length} Projects`;
  }
}
