import React from "react";
import { connect } from "react-redux";
import { actions as tradesActions } from "../../reducers/tradesReducer";
import Dashboard from "./Dashboard";
import InsertBalance from "./insertBalance/InsertBalance";
import chartHelper from "../../utils/chartHelper";

const hasDataLoaded = data => {
  return !!(
    data &&
    data.portfolioPerformance &&
    data.portfolioPerformance.length
  );
};

const DashboardContainer = ({
  data,
  onFileLoaded,
  filters,
  onFilterPressed
}) => {
  return (
    <div className="DashboardContainer">
      {hasDataLoaded(data) ? (
        <Dashboard
          onInit={onFileLoaded}
          data={data}
          filters={filters}
          onFilterPressed={onFilterPressed}
        />
      ) : (
        <InsertBalance onFileLoaded={onFileLoaded} />
      )}
    </div>
  );
};

const mapStateToProps = ({ trades }) => {
  const { data, activeCurrency, filters } = trades;
  const activeFilter = filters.find(x => x.active);
  const dashboardData = chartHelper.createDashboardData(
    data,
    activeCurrency,
    activeFilter
  );
  return {
    data: dashboardData,
    filters
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFileLoaded: data => {
      dispatch(tradesActions.initTrades(data));
    },
    onFilterPressed: filter => {
      dispatch(tradesActions.changeFilter(filter));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer);
