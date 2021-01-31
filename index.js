let backupData = {};
async function getData() {
  const res = await fetch("https://corona-api.com/countries/EG");
  const output = await res.json();
  showGraphs(output);
  showData(output);
  backupData = output;
}

getData();

const svgConfirmed = d3
  .select(".canvas-confirmed")
  .append("svg")
  .attr("width", 780)
  .attr("height", 500);
const svgNewConfirmed = d3
  .select(".canvas-new-confirmed")
  .append("svg")
  .attr("width", 780)
  .attr("height", 500);

const svgActive = d3
  .select(".canvas-active")
  .append("svg")
  .attr("width", 780)
  .attr("height", 500);

const svgDeaths = d3
  .select(".canvas-deaths")
  .append("svg")
  .attr("width", 780)
  .attr("height", 500);

const svgNewDeaths = d3
  .select(".canvas-new-deaths")
  .append("svg")
  .attr("width", 780)
  .attr("height", 500);

const svgRecovered = d3
  .select(".canvas-recovered")
  .append("svg")
  .attr("width", 780)
  .attr("height", 500);

const svgNewRecovered = d3
  .select(".canvas-new-recoverd")
  .append("svg")
  .attr("width", 780)
  .attr("height", 500);

function showGraphs(data) {
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

  drawGraph(
    svgConfirmed,
    timelineArr,
    "circle",
    "totalConfirmed",
    "#34CCFD",
    "إجمالي حالات فيروس كورونا",
    " الحالات"
  );
  drawGraph(
    svgNewConfirmed,
    timelineArr,
    "rect",
    "newConfirmed",
    "#666666",
    "الحالات اليومية لفيروس كورونا المستجد",
    "الحالات اليومية"
  );
  drawGraph(
    svgActive,
    timelineArr,
    "circle",
    "active",
    "#34CCFD",
    "مجموع مصابي فيروس كورونا الحالي",
    "المصابين حالياّ"
  );
  drawGraph(
    svgDeaths,
    timelineArr,
    "circle",
    "deaths",
    "#FC9928",
    "إجمالي الوفيات الناجمة عن فيروس كورونا",
    "الوفيات"
  );
  drawGraph(
    svgNewDeaths,
    timelineArr,
    "rect",
    "newDeaths",
    "#666666",
    "الوفيات اليومية بسبب فيروس كورونا المستجد",
    "الوفيات اليومية"
  );
  drawGraph(
    svgRecovered,
    timelineArr,
    "circle",
    "totalRecoverd",
    "#8ACA2B",
    "إجمالي المتعافين ",
    "المتعافين"
  );
  drawGraph(
    svgNewRecovered,
    timelineArr,
    "rect",
    "newRecovered",
    "#8ACA2B",
    "عدد المتعافين اليومي",
    "المتعافين"
  );
}

function drawGraph(svg, dataArr, type, dataType, color, yText, xText) {
  const margin = { top: 20, right: 20, bottom: 100, left: 100 };
  const graphWidth = 680 - margin.left - margin.right;
  const graphHeight = 400 - margin.top - margin.bottom;
  svg._groups[0][0].innerHTML = "";
  graph = svg
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

  const textContainer = graph
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (graphWidth / 2 + 25) +
        " ," +
        (graphHeight + margin.top + 50) +
        ")"
    );

  textContainer
    .append("path")
    .attr("stroke", color)
    .attr("stroke-width", 3)
    .attr("d", "M 0 11 L 16 11")
    .attr("transform", `translate(${xText.length > 9 ? "-70" : "-45"},-15)`);
  textContainer
    .append("path")
    .attr("fill", color)
    .attr("d", "M 8 15 A 4 4 0 1 1 8.003999999333336 14.999998000000167 Z")
    .attr("transform", `translate(${xText.length > 9 ? "-70" : "-45"},-15)`)
    .attr("style", "ball");

  textContainer
    .attr("class", "textContainer")
    .append("text")
    .style("text-anchor", "middle")
    .text(xText)
    .attr("fill", color)
    .attr("class", "toggle");

  graph
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -150)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(yText)
    .attr("fill", "#666666")
    .attr("font-size", "16px");

  const xScale = d3
    .scaleBand()
    .domain(dataArr.map((item) => item.date))
    .range([0, 670])
    .paddingInner(0);
  // .paddingOuter(0.2);

  if (type === "circle") {
    const rects = graph.append("g");
    rects
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

const newDeathsEl = document.getElementById("new-deaths");
const totalDeathsEl = document.getElementById("total-deaths");
const totalRecoveredEl = document.getElementById("total-recovered");
const newConfirmedEl = document.getElementById("new-confirmed");
const totalConfiremdEl = document.getElementById("total-confiremd");
const criticalEl = document.getElementById("critical");
const newRecoveredEl = document.getElementById("new-recovered");
const deadRateEl = document.getElementById("dead-rate");
const healRateEl = document.getElementById("heal-rate");
const todayDateEl = document.getElementById("today-date");

function showData(data) {
  const latestData = data.data.latest_data;
  const { deaths, confirmed, recovered, critical } = latestData;
  const { death_rate, recovery_rate } = latestData.calculated;
  const todayDeaths = data.data.today.deaths;
  const todayconfirmed = data.data.today.confirmed;
  const { new_confirmed, new_deaths, new_recovered } = data.data.timeline[0];

  totalDeathsEl.setAttribute("data-target", deaths);
  totalRecoveredEl.setAttribute("data-target", recovered);
  totalConfiremdEl.setAttribute("data-target", confirmed);
  criticalEl.setAttribute("data-target", critical);
  newRecoveredEl.setAttribute("data-target", new_recovered);
  newDeathsEl.setAttribute("data-target", new_deaths);
  newConfirmedEl.setAttribute("data-target", new_confirmed);
  deadRateEl.setAttribute("data-target", death_rate.toFixed(2));
  healRateEl.setAttribute("data-target", recovery_rate.toFixed(2));

  const totalRecoveredCounter = () => {
    const target = +totalRecoveredEl.getAttribute("data-target");
    const c = +totalRecoveredEl.innerHTML;

    const increment = target / 200;

    if (c < target) {
      totalRecoveredEl.innerHTML = `${Math.ceil(c + increment)}`;
      setTimeout(totalRecoveredCounter, 1);
    } else {
      totalRecoveredEl.innerHTML = target;
    }
  };

  const newRecoveredCounter = () => {
    const target = +newRecoveredEl.getAttribute("data-target");
    const c = +newRecoveredEl.innerHTML;

    const increment = target / 200;

    if (c < target) {
      newRecoveredEl.innerHTML = `${Math.ceil(c + increment)}`;
      setTimeout(newRecoveredCounter, 1);
    } else {
      newRecoveredEl.innerHTML = target;
    }
  };

  const newConfirmedCounter = () => {
    const target = +newConfirmedEl.getAttribute("data-target");
    const c = +newConfirmedEl.innerHTML;

    const increment = target / 200;

    if (c < target) {
      newConfirmedEl.innerHTML = `${Math.ceil(c + increment)}`;
      setTimeout(newConfirmedCounter, 1);
    } else {
      newConfirmedEl.innerHTML = target;
    }
  };

  const newDeathsCounter = () => {
    const target = +newDeathsEl.getAttribute("data-target");
    const c = +newDeathsEl.innerHTML;

    const increment = target / 200;

    if (c < target) {
      newDeathsEl.innerHTML = `${Math.ceil(c + increment)}`;
      setTimeout(newDeathsCounter, 1);
    } else {
      newDeathsEl.innerHTML = target;
    }
  };

  const totalDeathsCounter = () => {
    const target = +totalDeathsEl.getAttribute("data-target");
    const c = +totalDeathsEl.innerHTML;

    const increment = target / 200;

    if (c < target) {
      totalDeathsEl.innerHTML = `${Math.ceil(c + increment)}`;
      setTimeout(totalDeathsCounter, 1);
    } else {
      totalDeathsEl.innerHTML = target;
    }
  };

  const totalConfiremdCounter = () => {
    const target = +totalConfiremdEl.getAttribute("data-target");
    const c = +totalConfiremdEl.innerHTML;

    const increment = target / 200;

    if (c < target) {
      totalConfiremdEl.innerHTML = `${Math.ceil(c + increment)}`;
      setTimeout(totalConfiremdCounter, 1);
    } else {
      totalConfiremdEl.innerHTML = target;
    }
  };

  const criticalCounter = () => {
    const target = +criticalEl.getAttribute("data-target");
    const c = +criticalEl.innerHTML;

    const increment = target / 200;

    if (c < target) {
      criticalEl.innerHTML = `${Math.ceil(c + increment)}`;
      setTimeout(criticalCounter, 1);
    } else {
      criticalEl.innerHTML = target;
    }
  };

  const deadRateCounter = () => {
    const target = +deadRateEl.getAttribute("data-target");
    const c = +deadRateEl.innerHTML;

    const increment = target / 700;

    if (c < target) {
      deadRateEl.innerHTML = `${Math.ceil(c + increment)}`;
      setTimeout(deadRateCounter, 1);
    } else {
      deadRateEl.innerHTML = target;
    }
  };

  const healRateCounter = () => {
    const target = +healRateEl.getAttribute("data-target");
    const c = +healRateEl.innerHTML;

    const increment = target / 700;

    if (c < target) {
      healRateEl.innerHTML = `${Math.ceil(c + increment)}`;
      setTimeout(healRateCounter, 1);
    } else {
      healRateEl.innerHTML = target;
    }
  };
  totalRecoveredCounter();
  totalDeathsCounter();
  totalConfiremdCounter();
  criticalCounter();
  deadRateCounter();
  healRateCounter();
  newRecoveredCounter();
  newConfirmedCounter();
  newDeathsCounter();

  var date = new Date(subDays(1)).toLocaleDateString("ar-EG-u-nu-latn", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  function subDays(days) {
    var result = new Date();
    result.setDate(result.getDate() - days);
    return result;
  }

  todayDateEl.innerText = date;
}

// Hide Graph
setTimeout(() => {
  const toggles = document.querySelectorAll(".toggle");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      Array.from(e.target.parentElement.children).forEach((child) => {
        child.classList.toggle("clicked");
      });
      if (e.target.classList.contains("clicked")) {
        e.target.parentElement.parentElement.lastChild.style.opacity = "0";
      } else if (!e.target.classList.contains("clicked")) {
        e.target.parentElement.parentElement.lastChild.style.opacity = "1";
      }
    });
  });
}, 1000);
