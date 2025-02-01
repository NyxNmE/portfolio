import { fetchJSON, renderProjects, fetchGithubData } from './global.js';

(async function () {
  const projects = await fetchJSON('./lib/projects.json');
  if (projects.length > 0) {
    const latestProjects = projects.slice(0, 3); 
    const projectsContainer = document.querySelector('.projects');
    if (projectsContainer) {
      renderProjects(latestProjects, projectsContainer, 'h2');
    }
  } else {
    console.error("No projects found.");
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