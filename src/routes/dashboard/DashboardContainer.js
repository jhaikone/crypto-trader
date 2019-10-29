import React from "react";
import { connect } from "react-redux";
import { actions as tradesActions } from "../../reducers/tradesReducer";
import { Dashboard } from "./Dashboard";
import InsertBalance from "./insertBalance/InsertBalance";

const DashboardContainer = ({ data, activeCurrency, onFileLoaded }) => {
  return (
    <React.Fragment>
      {!data && !data.trades && !data.trades.length ? (
        <InsertBalance onFileLoaded={onFileLoaded} />
      ) : (
        <Dashboard data={data} activeCurrency={activeCurrency} />
      )}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  const { data, activeCurrency } = state.trades;
  return {
    data,
    activeCurrency
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
