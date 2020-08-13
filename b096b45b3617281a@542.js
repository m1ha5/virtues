// https://observablehq.com/@m1ha5/father-of-orphans-sunburst@542
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["new4.csv",new URL("./files/d1059ea3067c2adea2549798aa8d5ac15746dad9150fcaea163743dcb12fe7b7bd9db9ef664a0cd3f03373bb21b54114073a8c89542fe80181cdaee3c31bb411",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Father of Orphans Sunburst

بسم الله الرحمن الرحيم

Graphical representation of the virtues discussed in "The Father of Orphans" as per various traits of Imam Ali(as).  The inner most rings are the virtues, while the outer most are verses. A surah which contained multiple verses mapping a single virtue is reflected in the middle ring to help group the verses.

`
)});
  main.variable(observer("breadcrumb")).define("breadcrumb", ["d3","breadcrumbWidth","breadcrumbHeight","sunburst","breadcrumbPoints","color"], function(d3,breadcrumbWidth,breadcrumbHeight,sunburst,breadcrumbPoints,color)
{
  const svg = d3
    .create("svg")
    .attr("viewBox", `0 0 ${breadcrumbWidth * 10} ${breadcrumbHeight}`)
    .style("font", "10px sans-serif")
    .style("margin", "17px");

  const g = svg
    .selectAll("g")
    .data(sunburst.sequence)
    .join("g")
    .attr("transform", (d, i) => `translate(${i * breadcrumbWidth}, 0)`);

  g.append("polygon")
    .attr("points", breadcrumbPoints)
    .attr("fill", d => color(d.data.name))
    .attr("stroke", "white");

  g.append("text")
    .attr("x", (breadcrumbWidth + 10) / 2)
    .attr("y", 15)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text(d => d.data.name);

  svg
    .append("text")
    .text(sunburst.percentage > 0 ? sunburst.percentage + "%" : "")
    .attr("x", (sunburst.sequence.length + 0.5) * breadcrumbWidth)
    .attr("y", breadcrumbHeight / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle");

  return svg.node();
}
);
  main.variable(observer("viewof sunburst")).define("viewof sunburst", ["partition","data","d3","radius","width","color","arc","mousearc"], function(partition,data,d3,radius,width,color,arc,mousearc)
{
  const root = partition(data);
  const svg = d3.create("svg");
  // Make this into a view, so that the currently hovered sequence is available to the breadcrumb
  const element = svg.node();
  element.value = { sequence: [], percentage: 0.0 };

  const label = svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("fill", "#888")
    .style("visibility", "hidden");

  label
    .append("tspan")
    .attr("class", "percentage")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", "-0.1em")
    .attr("font-size", "3em")
    .text("");

  label
    .append("tspan")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", "1.5em")
    .text("% of surahs referenced speak out this aspect");

  svg
    .attr("viewBox", `${-radius} ${-radius} ${width} ${width}`)
    .style("max-width", `${width}px`)
    .style("font", "12px sans-serif");

  const path = svg
    .append("g")
    .selectAll("path")
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join("path")
    .attr("fill", d => color(d.data.name))
    .attr("d", arc);

  svg
    .append("g")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mouseleave", () => {
      path.attr("fill-opacity", 1);
      label.style("visibility", "hidden");
      // Update the value of this view
      element.value = { sequence: [], percentage: 0.0 };
      element.dispatchEvent(new CustomEvent("input"));
    })
    .selectAll("path")
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join("path")
    .attr("d", mousearc)
    .on("mouseenter", d => {
      // Get the ancestors of the current segment, minus the root
      const sequence = d
        .ancestors()
        .reverse()
        .slice(1);
      // Highlight the ancestors
      path
        .attr("fill-opacity", node =>
          sequence.indexOf(node) >= 0 ? 1.0 : 0.3
        );
      const percentage = ((100 * d.value) / root.value).toPrecision(3);
      label
        .style("visibility", null)
        .select(".percentage")
        .text(percentage + "%");
      // Update the value of this view with the currently hovered sequence and percentage
      element.value = { sequence, percentage };
      element.dispatchEvent(new CustomEvent("input"));
    });

  return element;
}
);
  main.variable(observer("sunburst")).define("sunburst", ["Generators", "viewof sunburst"], (G, _) => G.input(_));
  main.variable(observer("csv")).define("csv", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParseRows(await FileAttachment("new4.csv").text())
)});
  main.variable(observer("data")).define("data", ["buildHierarchy","csv"], function(buildHierarchy,csv){return(
buildHierarchy(csv)
)});
  main.variable(observer("partition")).define("partition", ["d3","radius"], function(d3,radius){return(
data =>
  d3.partition().size([2 * Math.PI, radius * radius])(
    d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)
  )
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3
  .scaleOrdinal()
      .domain(["5:3","5:55","5:67","Al_MAIDAH","7:181","9:119","13:7","33:33","36:12","53:1","53:2","53:3","53:4","AL_NAJM","LEADERSHIP","2:274","9:79","23:4","24:37","33:35","GENEROSITY","2:156","2:157","2:207","AL_BAQARA","3:61","3:145","3:146","3:147","3:148","3:173","AAL_IMRAN","5:54","DEVOTION","16:90","59:9","76:8","KINDNESS","3:103","4:83","6:153","39:33","42:1","7:44","7:46","7:157","AL_ARAF","8:11","8:62","AL_ANFAAL","SPIRTUALITY","end"])
        .range(["#B2DF36","#cae084","#B2DF36","#6ebd45","#a8d389","#6ebd45","#a8d389","#6ebd45","#a8d389","#cae08f","#B2DF36","#cae08f","#B2DF36","#6ebd45","#369847","#f68e2c","#fbb87b","#f68e2c","#fbb87b","#f68e2c","#f04824","#b84a9c","#ce90bf","#b84a9c","#b98bbe","#ce90bf","#b84a9c","#ce90bf","#b84a9c","#ce90bf","#b84a9c","#994b9d","#b98bbe","#693e96","#e5817d","#efb0a8","#e5817d","#d56b6d","#7ad1eb","#00b9e0","#7ad1eb","#00b9e0","#7ad1eb","#7ad1eb","#a8def1","#7ad1eb","#00b9e0","#a8def1","#7ad1eb","#7ad1eb","#02a0ca","#bbbbbb"])
)});
  main.variable(observer("width")).define("width", function(){return(
640
)});
  main.variable(observer("radius")).define("radius", ["width"], function(width){return(
width / 2
)});
  main.variable(observer("arc")).define("arc", ["d3","radius"], function(d3,radius){return(
d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .padAngle(1 / radius)
  .padRadius(radius)
  .innerRadius(d => Math.sqrt(d.y0))
  .outerRadius(d => Math.sqrt(d.y1) - 1)
)});
  main.variable(observer("mousearc")).define("mousearc", ["d3","radius"], function(d3,radius){return(
d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .innerRadius(d => Math.sqrt(d.y0))
  .outerRadius(radius)
)});
  main.variable(observer("buildHierarchy")).define("buildHierarchy", function(){return(
function buildHierarchy(csv) {
  // Helper function that transforms the given CSV into a hierarchical format.
  const root = { name: "root", children: [] };
  for (let i = 0; i < csv.length; i++) {
    const sequence = csv[i][0];
    const size = +csv[i][1];
    if (isNaN(size)) {
      // e.g. if this is a header row
      continue;
    }
    const parts = sequence.split("-");
    let currentNode = root;
    for (let j = 0; j < parts.length; j++) {
      const children = currentNode["children"];
      const nodeName = parts[j];
      let childNode = null;
      if (j + 1 < parts.length) {
        // Not yet at the end of the sequence; move down the tree.
        let foundChild = false;
        for (let k = 0; k < children.length; k++) {
          if (children[k]["name"] == nodeName) {
            childNode = children[k];
            foundChild = true;
            break;
          }
        }
        // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = { name: nodeName, children: [] };
          children.push(childNode);
        }
        currentNode = childNode;
      } else {
        // Reached the end of the sequence; create a leaf node.
        childNode = { name: nodeName, value: size };
        children.push(childNode);
      }
    }
  }
  return root;
}
)});
  main.variable(observer("breadcrumbWidth")).define("breadcrumbWidth", function(){return(
75
)});
  main.variable(observer("breadcrumbHeight")).define("breadcrumbHeight", function(){return(
30
)});
  main.variable(observer("breadcrumbPoints")).define("breadcrumbPoints", ["breadcrumbWidth","breadcrumbHeight"], function(breadcrumbWidth,breadcrumbHeight){return(
function breadcrumbPoints(d, i) {
  const tipWidth = 10;
  const points = [];
  points.push("0,0");
  points.push(`${breadcrumbWidth},0`);
  points.push(`${breadcrumbWidth + tipWidth},${breadcrumbHeight / 2}`);
  points.push(`${breadcrumbWidth},${breadcrumbHeight}`);
  points.push(`0,${breadcrumbHeight}`);
  if (i > 0) {
    // Leftmost breadcrumb; don't include 6th vertex.
    points.push(`${tipWidth},${breadcrumbHeight / 2}`);
  }
  return points.join(" ");
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
