let data = [];     
let commits = [];  

async function loadData() {
  data = await d3.csv("loc.csv", (row) => ({
    ...row,
    line: Number(row.line),
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + "T00:00" + row.timezone),
    datetime: new Date(row.datetime),
  }));

  displayStats();
  createScatterplot();
}

function processCommits() {
  const grouped = d3.groups(data, (d) => d.commit); 

  commits = grouped.map(([commitId, lines]) => {
    let first = lines[0];
    let hourFrac = first.datetime.getHours() + first.datetime.getMinutes() / 60;
    return {
      id: commitId,
      datetime: first.datetime,
      hourFrac
    };
  });
}

function displayStats() {
  processCommits();

  const dl = d3.select("#stats")
    .append("dl")
    .attr("class", "stats");

  // 1) Total LOC
  const locDiv = dl.append("div");
  locDiv.append("dt").html('Total <abbr title="Lines of code">LOC</abbr>');
  locDiv.append("dd").text(data.length);

  // 2) Total commits
  const commitsDiv = dl.append("div");
  commitsDiv.append("dt").text("Total commits");
  commitsDiv.append("dd").text(commits.length);

  // 3) Longest line
  const maxLine = d3.max(data, (d) => d.line);
  const lineDiv = dl.append("div");
  lineDiv.append("dt").text("Longest line");
  lineDiv.append("dd").text(maxLine);

  // 4) Max depth
  const maxDepth = d3.max(data, (d) => d.depth);
  const depthDiv = dl.append("div");
  depthDiv.append("dt").text("Max depth");
  depthDiv.append("dd").text(maxDepth);
}

function createScatterplot() {

  const width = 1000;
  const height = 600;
  const margin = { top: 10, right: 10, bottom: 30, left: 50 };

  const usableArea = {
    top: margin.top,
    left: margin.left,
    right: width - margin.right,
    bottom: height - margin.bottom,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const g = svg.append("g")
    .attr("transform", `translate(${usableArea.left},${usableArea.top})`);

  const xScale = d3.scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([0, usableArea.width])
    .nice();

  const yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([usableArea.height, 0]);

  
  const gridlines = g.append("g")
    .attr("class", "gridlines")  
    .call(
      d3.axisLeft(yScale)
        .tickSize(-usableArea.width) 
        .tickFormat("")              
    );

  g.append("g")
    .attr("class", "dots")
    .selectAll("circle")
    .data(commits)
    .join("circle")
    .attr("cx", (d) => xScale(d.datetime))
    .attr("cy", (d) => yScale(d.hourFrac))
    .attr("r", 5)
    .attr("fill", "steelblue");

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%b %d"));
  
  const yAxis = d3.axisLeft(yScale)
    .tickFormat((d) => String(d % 24).padStart(2, "0") + ":00");

  g.append("g")
    .attr("transform", `translate(0,${usableArea.height})`)
    .call(xAxis);

  g.append("g")
    .call(yAxis);
}

document.addEventListener("DOMContentLoaded", loadData);
