let data = [];

async function loadData() {
  // Load the CSV
  data = await d3.csv('loc.csv');
  console.log(data);
  
  // For example, display total lines of code on the page
  let totalLines = 0;
  data.forEach(row => {
    // Adjust this if your CSV column is named differently
    totalLines += +row.lines;
  });

  // Show it in #stats
  const statsDiv = document.getElementById('stats');
  statsDiv.textContent = `Total lines of code: ${totalLines}`;
}

document.addEventListener('DOMContentLoaded', loadData);
