import React, { Component } from "react";
import "./InsertBalance.scss";

import { Dropzone } from "../../../components/Dropzone";
import Plus from "../../../assets/icons/plus.svg";

const label = "Please drag n drop\nyour Binance order history here";

const emptyCircles = new Array(4).fill(true);

const Row = ({ children }) => (
  <div className=" CircleRow flex flex-row flex-center full-width">
    {children}
  </div>
);

const Circle = () => <div className="Circle"></div>;

class InsertBalance extends Component {
  render() {
    return (
      <div className="InsertBalanceContainer">
        <div className="dropzone">
          <Dropzone label={label} onDone={this.props.onFileLoaded}>
            <img className="plus" src={Plus} alt="plus" />
            <Row>
              {emptyCircles.map((x, i) => (
                <Circle key={`empty-circle-${i}`} />
              ))}
            </Row>
          </Dropzone>
        </div>
      </div>
    );
  }
}

export default InsertBalance;
