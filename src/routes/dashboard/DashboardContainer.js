import React from "react";
import { connect } from "react-redux";
import { actions as tradesActions } from "../../reducers/tradesReducer";
import Dashboard from "./Dashboard";
import InsertBalance from "./insertBalance/InsertBalance";
import chartHelper from "../../utils/chartHelper";

import background from "../../assets/images/background.png";
import backgroundvideo from "../../assets/videos/background.mp4";

const Background = ({ isDataLoaded }) => (
  <React.Fragment>
    {isDataLoaded ? (
      <img className="background-image" src={background} alt="background" />
    ) : (
      <video src={backgroundvideo} className="background-video" autoPlay loop />
    )}
  </React.Fragment>
);

const DashboardContainer = ({
  data,
  onFileLoaded,
  filters,
  onFilterPressed
}) => {
  const hasDataLoaded = chartHelper.hasDataLoaded(data);
  return (
    <div>
      <Background isDataLoaded={hasDataLoaded} />

      {hasDataLoaded ? (
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
