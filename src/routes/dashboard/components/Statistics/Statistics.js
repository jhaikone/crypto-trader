import React from "react";

import "./Statistics.scss";

const RowItem = ({ title, label, margin }) => (
  <div className={margin ? "flex-1 margin-left" : "flex-1"}>
    <div className="title">{title}</div>
    <div className="label">{label}</div>
  </div>
);

const Row = ({ children }) => (
  <div className="full-width flex flex-row flex-1">{children}</div>
);

const Statistics = ({ data }) => {
  return (
    <div className="Statistics flex flex-start">
      <div>
        <h5>{data.header}</h5>
      </div>
      {data.rows.map(row => (
        <Row key={row.id}>
          {row.items.map(x => (
            <RowItem key={x.id} title={x.title} label={x.value}></RowItem>
          ))}
        </Row>
      ))}
    </div>
  );
};

export default Statistics;

Statistics.defaultProps = {
  data: {}
};
