import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
  const projectsContainer = document.querySelector('.projects');

  if (!projectsContainer) {
    console.error("Projects container not found!");
    return;
  }

  const projects = await fetchJSON('../lib/projects.json');

  renderProjects(projects, projectsContainer, 'h2');
}

loadProjects();
