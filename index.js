async function getData() {
  const res = await fetch("https://corona-api.com/countries/EG");
  const output = await res.json();
  showData(output);
}

getData();

const svgConfirmed = d3
  .select(".canvas-confirmed")
  .append("svg")
  .attr("width", 780)
  .attr("height", 400);

const svgNewConfirmed = d3
  .select(".canvas-new-confirmed")
  .append("svg")
  .attr("width", 780)
  .attr("height", 400);

const svgActive = d3
  .select(".canvas-active")
  .append("svg")
  .attr("width", 780)
  .attr("height", 400);

const svgDeaths = d3
  .select(".canvas-deaths")
  .append("svg")
  .attr("width", 780)
  .attr("height", 400);

const svgNewDeaths = d3
  .select(".canvas-new-deaths")
  .append("svg")
  .attr("width", 780)
  .attr("height", 400);

const svgRecovered = d3
  .select(".canvas-recovered")
  .append("svg")
  .attr("width", 780)
  .attr("height", 400);

const svgNewRecovered = d3
  .select(".canvas-new-recoverd")
  .append("svg")
  .attr("width", 780)
  .attr("height", 400);

function showData(data) {
  const timeline = data.data.timeline;
  let timelineArr = [];
  timeline.forEach((day, idx) => {
    timelineArr.push({
      date: day.date,
      totalConfirmed: day.confirmed,
      deaths: day.deaths,
      totalRecoverd: day.recovered,
      newConfirmed: day.new_confirmed,
      newRecovered: day.new_recovered,
      newDeaths: day.new_deaths,
      active: day.active,
    });
  });

  timelineArr.reverse();
  console.log();
  drawGraph(svgConfirmed, timelineArr, "circle", "totalConfirmed", "#34CCFD");
  drawGraph(svgNewConfirmed, timelineArr, "rect", "newConfirmed", "#666666");
  drawGraph(svgActive, timelineArr, "circle", "active", "#34CCFD");
  drawGraph(svgDeaths, timelineArr, "circle", "deaths", "#FC9928");
  drawGraph(svgNewDeaths, timelineArr, "rect", "newDeaths", "#666666");
  drawGraph(svgRecovered, timelineArr, "circle", "totalRecoverd", "#8ACA2B");
  drawGraph(svgNewRecovered, timelineArr, "rect", "newRecovered", "#8ACA2B");
}

function drawGraph(svg, dataArr, type, dataType, color) {
  const margin = { top: 20, right: 20, bottom: 100, left: 100 };
  const graphWidth = 680 - margin.left - margin.right;
  const graphHeight = 400 - margin.top - margin.bottom;

  const graph = svg
    .append("g")
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .attr("transform", `translate(${60},${60})`);
  const xAxisGroup = graph
    .append("g")
    .attr("transform", `translate(0, ${graphHeight})`);
  const yAxisGroup = graph.append("g");

  const domain = d3.extent(dataArr, (d) => d[dataType]);

  const yScale = d3.scaleLinear().domain(domain).range([graphHeight, 0]);

  const xScale = d3
    .scaleBand()
    .domain(dataArr.map((item) => item.date))
    .range([0, 670])
    .paddingInner(0);
  // .paddingOuter(0.2);

  if (type === "circle") {
    const rects = graph
      .selectAll("circle")
      .data(dataArr)
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("fill", color)
      .attr("cx", (d, i) => xScale(d.date))
      .attr("cy", (d) => yScale(d[dataType]));
  } else if (type === "rect") {
    const rects = graph
      .selectAll("rect")
      .data(dataArr)
      .enter()
      .append("rect")
      .attr("width", 1)
      .attr("fill", color)
      .attr("x", (d, i) => xScale(d.date))
      .attr("height", (d) => graphHeight - yScale(d[dataType]))
      .attr("y", (d) => yScale(d[dataType]));
  }
  const yAxis = d3.axisLeft(yScale).ticks(10, "s");

  var xAxis = d3.axisBottom(xScale).tickValues(
    xScale.domain().filter(function (d, i) {
      return !(i % 17);
    })
  );

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  xAxisGroup
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .attr("text-anchor", "end")
    .attr("fill", "#666666");

  yAxisGroup.selectAll("text").attr("fill", "#666666");
}

/*
  // const domain = d3.extent(confirmed, (d) => d.totalConfirmed);

  // const yScale = d3.scaleLinear().domain(domain).range([graphHeight, 0]);

  // const xScale = d3
  //   .scaleBand()
  //   .domain(confirmed.map((item) => item.date))
  //   .range([0, 670])
  //   .paddingInner(0);
  // // .paddingOuter(0.2);

  // const rects = graph
  //   .selectAll("circle")
  //   .data(confirmed)
  //   .enter()
  //   .append("circle")
  //   .attr("r", 3)
  //   .attr("fill", "#34CCFD")
  //   .attr("cx", (d, i) => xScale(d.id))
  //   .attr("cy", (d) => yScale(d.cases));

  // const yAxis = d3.axisLeft(yScale).ticks(10, "s");

  // var xAxis = d3.axisBottom(xScale).tickValues(
  //   xScale.domain().filter(function (d, i) {
  //     return !(i % 17);
  //   })
  // );

  // xAxisGroup.call(xAxis);
  // yAxisGroup.call(yAxis);

  // xAxisGroup
  //   .selectAll("text")
  //   .attr("transform", "rotate(-40)")
  //   .attr("text-anchor", "end")
  //   .attr("fill", "#666666");

  // yAxisGroup.selectAll("text").attr("fill", "#666666");

  */
