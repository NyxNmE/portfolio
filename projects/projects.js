import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from '../global.js';

(async function () {
  let selectedIndex = -1;

  const allProjects = await fetchJSON('../lib/projects.json');
  if (!allProjects || allProjects.length === 0) {
    console.error("No projects found.");
    return;
  }

  const projectsContainer = document.querySelector('.projects');
  const searchInput       = document.querySelector('.searchBar');
  const svg               = d3.select("#projects-pie-plot");
  const legend            = d3.select(".pie-legend");

  
  function renderEverything() {
    let filtered = getFilteredProjects(); 

    renderProjects(filtered, projectsContainer, 'h2');

    drawPie(filtered);
  }

  function getFilteredProjects() {
    let query = searchInput.value.toLowerCase();
    let base = allProjects.filter((proj) => {
      let joinedValues = Object.values(proj).join('\n').toLowerCase();
      return joinedValues.includes(query);
    });


    if (selectedIndex < 0) {
      return base;
    }

    let rolled = d3.rollups(base, v => v.length, d => d.year);
    let arcsData = rolled.map(([year, count]) => ({ label: year, value: count }));

    if (selectedIndex >= arcsData.length) {
      return base; 
    }

    let selectedYear = arcsData[selectedIndex].label;
    return base.filter((p) => p.year === selectedYear);
  }

  function drawPie(projectsGiven) {
    svg.selectAll("path").remove();
    legend.selectAll("li").remove();

    if (!projectsGiven || projectsGiven.length === 0) {
      return;
    }

    let rolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year
    );
    let data = rolledData.map(([year, count]) => ({
      label: year || "N/A",
      value: count
    }));

    const colors = d3.scaleOrdinal(d3.schemeTableau10);
    const arcGen = d3.arc().innerRadius(0).outerRadius(50);
    const pieGen = d3.pie().value((d) => d.value);
    const arcData = pieGen(data); 

    svg.selectAll("path")
      .data(arcData)
      .enter()
      .append("path")
      .attr("d", arcGen)
      .attr("fill", (d, i) => colors(i))
      .attr("stroke", "black")
      .attr("stroke-width", "1px")
      .on("click", (event, dArc) => {
        let i = dArc.index; // which wedge is this?
        selectedIndex = (selectedIndex === i) ? -1 : i;
        renderEverything();
      });

    let li = legend.selectAll("li")
      .data(arcData)
      .enter()
      .append("li")
      .attr('style', (dArc, i) => `--color:${colors(i)}`)
      .html((dArc) => {
        return `
          <span class="swatch" style="background-color:${colors(dArc.index)}"></span> 
          ${dArc.data.label} <em>(${dArc.data.value})</em>
        `;
      })
      .on("click", (event, dArc) => {
        let i = dArc.index;
        selectedIndex = (selectedIndex === i) ? -1 : i;
        renderEverything();
      });

    
    svg.selectAll("path")
      .attr("class", (_, i) => i === selectedIndex ? 'selected' : '');

    legend.selectAll("li")
      .attr("class", (_, i) => i === selectedIndex ? 'selected' : '');
  }

  
  searchInput.addEventListener('input', () => {
    
    renderEverything();
  });

  
  renderEverything();
})();
