import React from "react";

export const GridSpace = ({ orientation }) => {
  const classes =
    orientation === "around"
      ? "grid-spacing"
      : orientation === "vertical"
      ? "grid-spacing-vertical"
      : "grid-spacing-horizontal";
  return <div className={classes}></div>;
};

GridSpace.defaultProps = {
  orientation: "around"
};
