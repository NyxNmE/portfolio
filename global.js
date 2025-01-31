console.log("IT'S ALIVE!");

export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains("home");

const pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "resume/", title: "Resume" },
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

// Inject Dark Mode Switch
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

// Load saved theme preference
const savedTheme = localStorage.getItem("preferred-theme");
if (savedTheme) {
  themeSwitcher.value = savedTheme;
  document.documentElement.style.colorScheme = savedTheme;
}

// Fetch JSON Data
export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching or parsing JSON data:", error);
  }
}

// Render Projects Function
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!containerElement) {
    console.error("Container element is missing or invalid.");
    return;
  }

  containerElement.innerHTML = ''; // Clear existing content

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

  // Update Project Count Display
  const projectTitleElement = document.querySelector('.projects-title');
  if (projectTitleElement) {
    projectTitleElement.textContent = `${projects.length} Projects`;
  }
}

// Fetch GitHub Data Function
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/NyxNmE`);
}
