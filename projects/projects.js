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
  }

  const rolledData = d3.rollups(
    projects,
    v => v.length,    
    d => d.year       
  );

  const data = rolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));

  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

  const sliceGenerator = d3.pie()
    .value(d => d.value);

  const arcData = sliceGenerator(data);

  const svg = d3.select("#projects-pie-plot");
  svg.selectAll("path")
    .data(arcData)
    .enter()
    .append("path")
    .attr("d", arcGenerator)
    .attr("fill", (d, i) => colors(i))
    .attr("stroke", "black")
    .attr("stroke-width", "1px");

  let legend = d3.select(".pie-legend");
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .html(`
        <span class="swatch" style="background-color:${colors(idx)}"></span>
        ${d.label} <em>(${d.value})</em>
      `);
  });
})();
