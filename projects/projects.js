import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

(async function () {
  const projects = await fetchJSON('../lib/projects.json');
  if (!projects || projects.length === 0) {
    console.error("No projects found.");
    return;
  }

  const projectsContainer = document.querySelector('.projects');
  if (projectsContainer) {
    renderProjects(projects, projectsContainer, 'h2');
  } else {
    console.error("Projects container not found.");
  }

  const svg = d3.select('#projects-pie-plot');

  let arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

  let arc = arcGenerator({
    startAngle: 0,
    endAngle: 2 * Math.PI,
  });

  svg.append('path')
    .attr('d', arc)
    .attr('fill', 'red');
})();
