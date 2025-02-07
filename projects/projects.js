import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from '../global.js';

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

  let data = [
    { value: 1, label: 'Apples' },
    { value: 2, label: 'Oranges' },
    { value: 3, label: 'Mangos' },
    { value: 4, label: 'Pears' },
    { value: 5, label: 'Limes' },
    { value: 5, label: 'Cherries' }
  ];

  let sliceGenerator = d3.pie().value(d => d.value);
  let arcData = sliceGenerator(data);

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let svg = d3.select('#projects-pie-plot');

  svg.selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', (d, i) => colors(i))
    .attr('stroke', 'black')
    .attr('stroke-width', 1);

  let legend = d3.select('.pie-legend');

  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });

})();
