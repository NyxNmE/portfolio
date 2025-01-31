import { fetchJSON, renderProjects } from '../global.js';

(async function () {
  const projects = await fetchJSON('../lib/projects.json');
  console.log("Fetched Projects:", projects);

  const projectsContainer = document.querySelector('.projects');
  renderProjects(projects, projectsContainer, 'h2');
})();
