import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let data = [];

async function loadData() {
  data = await d3.csv('./loc.csv');
  console.log("Loaded LOC data:", data);

  let totalLines = 0;
  data.forEach(row => {
    totalLines += +row.lines;
  });

  const statsDiv = document.getElementById('stats');
  statsDiv.textContent = `Total lines of code: ${totalLines}`;
}

document.addEventListener('DOMContentLoaded', loadData);
