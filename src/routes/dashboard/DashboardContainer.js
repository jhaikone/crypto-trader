import React from "react";
import { connect } from "react-redux";
import { actions as tradesActions } from "../../reducers/tradesReducer";
import { Dashboard } from "./Dashboard";
import InsertBalance from "./insertBalance/InsertBalance";

const DashboardContainer = ({ data, onFileLoaded }) => {
  return (
    <React.Fragment>
      {!data && !data.trades && !data.trades.length ? (
        <InsertBalance onFileLoaded={onFileLoaded} />
      ) : (
        <Dashboard data={data} />
      )}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  const { data } = state.trades;
  return {
    data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFileLoaded: data => {
      dispatch(tradesActions.initTrades(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer);
