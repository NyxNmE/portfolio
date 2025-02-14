let data = [];
let commits = [];

let brushSelection = null;

let xScale, yScale;

async function loadData() {
  data = await d3.csv("loc.csv", (row) => ({
    ...row,
    line: +row.line,
    depth: +row.depth,
    length: +row.length,
    date: new Date(row.date + "T00:00" + row.timezone),
    datetime: new Date(row.datetime),
  }));

  displayStats();
  createScatterplot();
}

function processCommits() {
  const grouped = d3.groups(data, (d) => d.commit);
  commits = grouped.map(([commitId, lines]) => {
    const first = lines[0];
    const hourFrac = first.datetime.getHours() + first.datetime.getMinutes() / 60;
    const totalLines = d3.sum(lines, (l) => l.line);

    const lineDetails = lines.map(d => ({
      type: d.type || "Unknown",
      lines: d.line
    }));

    return {
      id: commitId,
      url: "https://github.com/YourRepo/commit/" + commitId,
      datetime: first.datetime,
      hourFrac,
      totalLines,
      lines: lineDetails
    };
  });
}

function displayStats() {
  processCommits();

  const dl = d3.select("#stats")
    .append("dl")
    .attr("class", "stats");

  // total LOC
  dl.append("div").call(div => {
    div.append("dt").html('Total <abbr title="Lines of code">LOC</abbr>');
    div.append("dd").text(data.length);
  });

  // total commits
  dl.append("div").call(div => {
    div.append("dt").text("Total commits");
    div.append("dd").text(commits.length);
  });

  // longest line
  const maxLine = d3.max(data, d => d.line);
  dl.append("div").call(div => {
    div.append("dt").text("Longest line");
    div.append("dd").text(maxLine);
  });

  // max depth
  const maxDepth = d3.max(data, d => d.depth);
  dl.append("div").call(div => {
    div.append("dt").text("Max depth");
    div.append("dd").text(maxDepth);
  });
}

function createScatterplot() {
  const width = 700;
  const height = 400;
  const margin = { top: 10, right: 10, bottom: 30, left: 50 };

  const usableArea = {
    left: margin.left,
    top: margin.top,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("max-width", "700px")
    .style("height", "auto");

  const g = svg.append("g")
    .attr("transform", `translate(${usableArea.left},${usableArea.top})`);

  xScale = d3.scaleTime()
    .domain(d3.extent(commits, d => d.datetime))
    .range([0, usableArea.width])
    .nice();

  yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([usableArea.height, 0]);

  const [minLines, maxLines] = d3.extent(commits, d => d.totalLines);
  const rScale = d3.scaleSqrt()
    .domain([minLines, maxLines])
    .range([2, 30]);

  const sortedCommits = commits.slice().sort((a,b) => b.totalLines - a.totalLines);

  g.append("g")
    .attr("class", "gridlines")
    .call(
      d3.axisLeft(yScale)
        .tickSize(-usableArea.width)
        .tickFormat("")
    );

  const brushGroup = g.append("g").attr("class", "brush-group");

  const dots = g.append("g")
    .attr("class", "dots")
    .selectAll("circle")
    .data(sortedCommits)
    .join("circle")
    .attr("cx", d => xScale(d.datetime))
    .attr("cy", d => yScale(d.hourFrac))
    .attr("r", d => rScale(d.totalLines))
    .style("fill", "steelblue")
    .style("fill-opacity", 0.7);

  dots
    .on("mouseenter", (event, commit) => {
      d3.select(event.currentTarget).style("fill-opacity", 1);
      updateTooltipContent(commit);
      updateTooltipVisibility(true);
    })
    .on("mousemove", (event) => {
      updateTooltipPosition(event.pageX, event.pageY);
    })
    .on("mouseleave", (event) => {
      d3.select(event.currentTarget).style("fill-opacity", 0.7);
      updateTooltipContent({});
      updateTooltipVisibility(false);
    });

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00");

  g.append("g")
    .attr("transform", `translate(0,${usableArea.height})`)
    .call(xAxis);
  g.append("g").call(yAxis);

  const brush = d3.brush()
    .extent([[0,0],[usableArea.width, usableArea.height]])
    .on("start brush end", brushed);

  brushGroup.call(brush);

  dots.raise();

  function brushed(event) {
    if (!event.selection) {
      brushSelection = null;
      updateSelection();
      return;
    }
    brushSelection = event.selection;
    updateSelection();
  }
}

function isCommitSelected(commit) {
  if (!brushSelection) return false;

  const [[x0, y0], [x1, y1]] = brushSelection;
  const cx = xScale(commit.datetime);
  const cy = yScale(commit.hourFrac);

  return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
}

function updateSelection() {
  d3.selectAll("circle")
    .classed("selected", d => isCommitSelected(d));

  updateSelectionCount();

  updateLanguageBreakdown();
}

function updateSelectionCount() {
  const selectedCommits = brushSelection
    ? commits.filter(isCommitSelected)
    : [];

  const countEl = document.getElementById("selection-count");
  countEl.textContent = selectedCommits.length
    ? `${selectedCommits.length} commits selected`
    : `No commits selected`;
}


function updateLanguageBreakdown() {
  const selectedCommits = brushSelection
    ? commits.filter(isCommitSelected)
    : [];

  const container = document.getElementById("language-breakdown");
  if (!selectedCommits.length) {
    container.innerHTML = "";
    return;
  }
  const lines = selectedCommits.flatMap(d => d.lines);

  const breakdown = d3.rollup(
    lines,
    v => v.length,   
    d => d.type
  );

  const total = lines.length;
  container.innerHTML = "";

  for (const [language, count] of breakdown) {
    const proportion = count / total;
    const formatted = d3.format(".1%")(proportion); 
    container.innerHTML += `
      <dt>${language}</dt>
      <dd>${count} lines (${formatted})</dd>
    `;
  }
}

function updateTooltipContent(commit) {
  const linkEl = document.getElementById("commit-link");
  const dateEl = document.getElementById("commit-date");

  if (!commit || Object.keys(commit).length === 0) {
    linkEl.href = "#";
    linkEl.textContent = "";
    dateEl.textContent = "";
    return;
  }

  linkEl.href = commit.url;
  linkEl.textContent = commit.id;
  dateEl.textContent = commit.datetime?.toLocaleDateString("en", {
    dateStyle: "full",
  });
}

function updateTooltipVisibility(isVisible) {
  const tooltip = document.getElementById("commit-tooltip");
  tooltip.hidden = !isVisible;
}

function updateTooltipPosition(x, y) {
  const tooltip = document.getElementById("commit-tooltip");
  tooltip.style.left = (x + 10) + "px";
  tooltip.style.top  = (y + 20) + "px";
}

document.addEventListener("DOMContentLoaded", loadData);
