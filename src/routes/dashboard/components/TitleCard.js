import React from "react";
import "../../../index.scss";
import "./TitleCard.scss";
import tradeCalculator from "../../../utils/tradeCalculator";

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

const SubLabel = ({ classes, header, value }) => (
  <div className={classes}>
    <div>
      <h4 className="no-margin no-decoration">{header}</h4>
    </div>
    <div>
      <h3 className="no-margin no-decoration">{value}</h3>
    </div>
  </div>
);

export const TitleCard = ({ data }) => {
  const titleData = tradeCalculator.getTradeBalances(
    data.balances,
    data.capital
  );
  return (
    <div className="largeContainer flex row flex-start flex-center-row titleCardContainer">
      <Label
        classes="flex-start text-left flex-3"
        header={"Portfolio"}
        value="1.6ETH"
      />
      <SubLabel
        classes="flex-end text-left flex-1"
        header={"Starting point"}
        value={"1.2ETH"}
      />
      <SubLabel classes="flex-end text-left" header={"Gain"} value={"0.4ETH"} />
    </div>
  );
};
