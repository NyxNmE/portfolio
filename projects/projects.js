import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
  const projectsContainer = document.querySelector('.projects');
  const titleElement = document.querySelector('.projects-title');

  if (!projectsContainer || !titleElement) {
    console.error("Projects container or title element not found!");
    return;
  }

  const projects = await fetchJSON('../lib/projects.json');

  titleElement.textContent = `${projects.length} Projects`;

  renderProjects(projects, projectsContainer, 'h2');
}

loadProjects();

