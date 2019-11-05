import React from "react";

import "./Card.scss";

export const Card = ({ children }) => <div className="Card">{children}</div>;
export const CardHeader = ({ label, children }) => (
  <div className="smallContainer CardHeader flex flex-row flex-center">
    <div className="flex-1 text-left flex-start-row">
      <h3 className="no-margin">{label}</h3>
    </div>

    {children}
  </div>
);

export const CardBody = ({ children }) => {
  return <div className="CardBody">{children}</div>;
};
