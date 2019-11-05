import React from "react";
import "../../../index.scss";
import "./TitleCard.scss";
import formatter from "../../../utils/formatter";

const Label = ({ classes, header, value }) => (
  <div className={classes}>
    <div>
      <h2 className="no-margin">{header}</h2>
    </div>
  </div>
);

const Balance = ({ data }) => (
  <div className="balance">
    <h3 className="no-margin label">{data.currency}</h3>
    <h3 className="no-margin">{formatter.formatCurrency(data.total)}</h3>
  </div>
);

export const TitleCard = ({ balances }) => {
  return (
    <div className="largeContainer flex flex-row flex-start flex-center-row margin titleCardContainer">
      <Label classes="flex-start text-left flex-3" header="Portfolio" />
      {balances.map(balance => (
        <React.Fragment key={balance.currency}>
          <Balance data={balance} />
          <div className="divider"></div>
        </React.Fragment>
      ))}
    </div>
  );
};

TitleCard.defaultProps = {
  balances: []
};
