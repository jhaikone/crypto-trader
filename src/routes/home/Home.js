import React, { Component } from "react";
import "./Home.css";

import { Dropzone } from "../../components/Dropzone";

class Home extends Component {
  render() {
    return (
      <div className="homeContainer">
        {/*      <EventSeat className="icon" />
        <div className="trader">Trader's hot seat</div> */}
        <Dropzone onDone={this.props.onInitTrades} />
      </div>
    );
  }
}

export default Home;
