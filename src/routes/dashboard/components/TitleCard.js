import React from "react";
import "../../../index.scss";
import "./TitleCard.scss";
import formatter from "../../../utils/formatter";

const Label = ({ classes, header, value }) => (
  <div className={classes}>
    <div>
      <h3 className="no-margin no-decoration">{header}</h3>
    </div>
    <div>
      <h2 className="no-margin no-decoration">{value}</h2>
    </div>
  </div>
);

export const TitleCard = ({ data }) => {
  return (
    <div className="largeContainer flex flex-row flex-start flex-center-row titleCardContainer">
      <Label
        classes="flex-start text-left flex-3"
        header={`${data.currency} Portfolio`}
        value={`${formatter.formatCurrency(data.total)}`}
      />
    </div>
  );
};
