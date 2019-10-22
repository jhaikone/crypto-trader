import React, { Component } from "react";
import "./InsertBalance.scss";

import { Dropzone } from "../../../components/Dropzone";
import Plus from "../../../assets/icons/plus.svg";

class InsertBalance extends Component {
  render() {
    return (
      <div className="insertBalanceContainer">
        <div className="dropzone">
          <Dropzone onDone={this.props.onFileLoaded}>
            <img className="plus" src={Plus} />
          </Dropzone>
        </div>
      </div>
    );
  }
}

export default InsertBalance;
