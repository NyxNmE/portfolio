import { fetchJSON, renderProjects, fetchGitHubData } from '../global.js';

(async function () {
  const projects = await fetchJSON('../lib/projects.json');
  console.log("Fetched Projects for Index Page:", projects);

  if (projects) {
    const latestProjects = projects.slice(0, 3);
    const projectsContainer = document.querySelector('.projects');
    renderProjects(latestProjects, projectsContainer, 'h2');
  }

  const githubUsername = 'NyxNmE';
  const githubData = await fetchGitHubData(githubUsername);
  console.log("GitHub Data:", githubData);

  const profileStats = document.querySelector('#profile-stats');

  if (githubData && profileStats) {
    profileStats.innerHTML = `
      <dl>
        <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
        <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
        <dt>Followers:</dt><dd>${githubData.followers}</dd>
        <dt>Following:</dt><dd>${githubData.following}</dd>
      </dl>
    `;
  }
})();
