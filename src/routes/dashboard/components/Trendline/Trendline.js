import React from "react";
import "./Trendline.scss";
import {
  LineChart,
  Line,
  YAxis,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import chartHelper from "../../../../utils/chartHelper";

const Trendline = ({ data, lineType }) => {
  return (
    <div className="Trendline flex flex-row">
      <ResponsiveContainer width="100%" height={"90%"}>
        <LineChart data={data} {...chartHelper.getLineChartDefaults()}>
          <CartesianGrid vertical={false} stroke="#28303D" />
          <Line left={-100} type={lineType} dataKey="value" stroke="#268dae" />

          <YAxis
            tick={{ dx: -20 }}
            dataKey="value"
            tickFormatter={chartHelper.toPercentage}
            stroke="#5f656e"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Trendline;

Trendline.defaultProps = {
  lineType: "natural"
};
