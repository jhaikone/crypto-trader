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

const findBiggestValue = array => {
  return array.reduce((previousLargestNumber, currentLargestNumber) => {
    return currentLargestNumber.value > previousLargestNumber
      ? currentLargestNumber.value
      : previousLargestNumber;
  }, 0);
};

const calculateoffset = value => {
  return value < 100 ? -20 : value < 1000 ? -10 : 0;
};

const Trendline = ({ data, lineType }) => {
  return (
    <div className="Trendline">
      <ResponsiveContainer width="100%" height={"90%"}>
        <LineChart data={data} {...chartHelper.getLineChartDefaults()}>
          <CartesianGrid vertical={false} stroke="#28303D" />
          <Line left={-100} type={lineType} dataKey="value" stroke="#268dae" />

          <YAxis
            tick={{ dx: calculateoffset(findBiggestValue(data)) }}
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
  lineType: "natural",
  data: []
};
