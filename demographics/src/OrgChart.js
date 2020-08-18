import React, { useLayoutEffect, useRef } from "react";
import TreeChart from "d3-org-chart";

export const OrgChartComponent = props => {
  const d3Container = useRef(null);
  let chart = null;
  // We need to manipulate DOM
  useLayoutEffect(() => {
    if (props.data && d3Container.current) {
      if (!chart) {
        chart = new TreeChart();
      }
      chart
        .container(d3Container.current)
        .data(props.data)
        .svgWidth(500)
        .initialZoom(0.4)
        .onNodeClick(d => console.log(d + " node clicked"))
        .render();
    }
  }, [props.data, d3Container.current]);

  return (
    <div>
      <div ref={d3Container} />
    </div>
  );
};
