import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import "./style.css";
import { OrgChartComponent } from "./OrgChart";
import * as d3 from "d3";

const App = props => {
  const [data, setData] = useState(null);
  useEffect(() => {
    d3.json(
      "foo.json"
    ).then(data => {
      setData(data);
    });
  }, [true]);
  return <OrgChartComponent data={data} />;
};

render(<App />, document.getElementById("root"));
