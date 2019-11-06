import React, { Component } from "react";
import "./InsertBalance.scss";
import { FileUploader } from "../../../components/ui/fileUploader/FileUploader";

class InsertBalance extends Component {
  render() {
    return (
      <div className="InsertBalance">
        <h1 className="main-header">Analyze your Binance</h1>
        <h1 className="main-header">order history.</h1>
        <h1 className="sub-header">Do you buy low, sell high?</h1>
        <div className="margin-top">
          <FileUploader onDone={this.props.onFileLoaded} />
        </div>
      </div>
    );
  }
}

export default InsertBalance;
