import { fetchJSON, renderProjects } from './global.js';

(async function () {
  const projects = await fetchJSON('./lib/projects.json');

  if (!projects || projects.length === 0) {
    console.error("No projects found.");
    return;
  }

  const latestProjects = projects.slice(0, 3);

  const projectsContainer = document.querySelector('.projects');

  if (projectsContainer) {
    renderProjects(latestProjects, projectsContainer, 'h2');
  } else {
    console.error("Projects container not found on home page.");
  }
})();