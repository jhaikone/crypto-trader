import React from "react";
import {
  Line,
  YAxis,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Bar,
  ReferenceLine
} from "recharts";

import "./Barchart.scss";
import chartHelper from "../../../../utils/chartHelper";

const Barchart = ({ data, lineType }) => {
  return (
    <div className="Barchart flex flex-row">
      <ResponsiveContainer width="100%" height={"90%"}>
        <BarChart data={data} {...chartHelper.getLineChartDefaults()}>
          <ReferenceLine y={0} stroke="#000" />
          <CartesianGrid vertical={false} stroke="#28303D" />
          <Line left={-100} type={lineType} dataKey="value" stroke="#268dae" />
          <Bar label="false" dataKey="value" fill="#268dae" />
          <YAxis
            tick={{ dx: -30 }}
            stroke="#5f656e"
            tickFormatter={chartHelper.toPercentage}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Barchart;

Barchart.defaultProps = {
  lineType: "natural"
};
