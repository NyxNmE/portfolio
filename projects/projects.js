import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let projects = [
  { year: "2024" },
  { year: "2023" },
  { year: "2023" },
  { year: "2022" },
  { year: "2022" },
  { year: "2021" },
  { year: "2021" },
];

let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year
);

let data = rolledData.map(([year, count]) => ({ value: count, label: year }));

let colors = d3.scaleOrdinal(d3.schemeTableau10);

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let sliceGenerator = d3.pie().value((d) => d.value);
let arcs = sliceGenerator(data);

d3.select("svg")
  .selectAll("path")
  .data(arcs)
  .join("path")
  .attr("d", arcGenerator)
  .attr("fill", (_, i) => colors(i))
  .attr("stroke", "black")
  .attr("stroke-width", 1);

let legend = d3.select(".pie-legend");
legend
  .selectAll("li")
  .data(data)
  .join("li")
  .attr("style", (_, i) => `--color:${colors(i)}`)
  .html((d) => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
