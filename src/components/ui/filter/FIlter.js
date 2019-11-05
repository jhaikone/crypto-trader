import React from "react";
import "./Filter.scss";
import { Button } from "@material-ui/core";

export const Filter = ({ onClick, data }) => {
  const classes = data.active ? "Filter active" : "Filter";
  return (
    <Button onClick={() => onClick(data)}>
      <div className={classes}>{data.label}</div>
    </Button>
  );
};

Filter.defaultProps = {
  onClick: () => null,
  data: {}
};
