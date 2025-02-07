import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects, fetchGithubData } from './global.js';

(async function () {
  const projects = await fetchJSON('/portfolio/lib/projects.json');
  if (!projects || projects.length === 0) {
    console.error("No projects found.");
  } else {
    const latestProjects = projects.slice(0, 3); 
    const projectsContainer = document.querySelector('.projects');
    if (projectsContainer) {
      renderProjects(latestProjects, projectsContainer, 'h2');
    }

    renderHomePieChart(projects);
  }

  const githubUsername = "NyxNmE"; 
  const githubData = await fetchGithubData(githubUsername);
  if (githubData) {
    const githubContainer = document.querySelector('.github-profile');
    if (githubContainer) {
      githubContainer.innerHTML = `
        <h2>GitHub Profile</h2>
        <p><strong>Name:</strong> ${githubData.name || "N/A"}</p>
        <p><strong>Username:</strong> ${githubData.login}</p>
        <p><strong>Followers:</strong> ${githubData.followers}</p>
        <p><strong>Following:</strong> ${githubData.following}</p>
        <p><strong>Public Repos:</strong> ${githubData.public_repos}</p>
        <img src="${githubData.avatar_url}" alt="GitHub Avatar" width="100">
      `;
    }
  }
})();

function renderHomePieChart(allProjects) {
  const rolledData = d3.rollups(
    allProjects,
    v => v.length,
    d => d.year
  );

  const data = rolledData.map(([year, count]) => {
    return { value: count, label: year || "N/A" };
  });

  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const arcGen = d3.arc().innerRadius(0).outerRadius(50);
  const pieGen = d3.pie().value(d => d.value);
  const arcData = pieGen(data);

  const svg = d3.select("#projects-pie-plot");
  svg.selectAll("path")
    .data(arcData)
    .enter()
    .append("path")
    .attr("d", arcGen)
    .attr("fill", (d, i) => colors(i))
    .attr("stroke", "black")
    .attr("stroke-width", "1px");

  const legend = d3.select(".pie-legend");
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .html(`
        <span class="swatch" style="background-color:${colors(idx)}"></span> 
        ${d.label} <em>(${d.value})</em>
      `);
  });
}
