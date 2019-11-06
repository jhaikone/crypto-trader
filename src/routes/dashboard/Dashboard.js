import React, { Component } from "react";
import { TitleCard } from "./components/TitleCard";
import { Card, CardHeader, CardBody } from "../../components/ui";
import Trendline from "./components/Trendline/Trendline";
import Barchart from "./components/Barchart/Barchart";
import "./Dashboard.scss";
import Statistics from "./components/Statistics/Statistics";
import UiTable from "../../components/ui/table/UiTable";
import chartHelper from "../../utils/chartHelper";
import { Filter } from "../../components/ui/filter/FIlter";

const LeftContent = ({ children }) => (
  <div className="LeftContent flex-1 margin">{children}</div>
);

const RightContent = ({ children }) => (
  <div className="RightContent flex-2 margin">{children}</div>
);

const FilterRow = ({ filters, onClick }) => (
  <div className="margin-top flex flex-row flex-wrap">
    {filters.map(filter => (
      <Filter key={filter.label} data={filter} onClick={onClick} />
    ))}
  </div>
);

class Dashboard extends Component {
  componentDidMount() {
    /*     const mockData = chartHelper.getMockData();

    this.props.onInit({
      ...mockData
    }); */
  }

  render() {
    const { data } = this.props;

    return (
      <div className="DashboardContainer">
        <div className="Dashboard">
          <TitleCard balances={data.wallet} />

          <FilterRow
            filters={this.props.filters}
            onClick={this.props.onFilterPressed}
          />

          <div className="flex flex-row flex-wrap">
            <LeftContent>
              <Card>
                <CardHeader label="Statistics"></CardHeader>
                <CardBody>
                  <Statistics data={data.statistics} />
                </CardBody>
              </Card>
            </LeftContent>

            <RightContent>
              <Card>
                <CardHeader label="Portfolio performance"></CardHeader>
                <CardBody>
                  <Trendline data={data.portfolioPerformance} />
                </CardBody>
              </Card>
            </RightContent>
          </div>

          <div className="margin">
            <Card>
              <CardHeader label="Single Trade Profits"></CardHeader>
              <CardBody>
                <Barchart data={data.tradeTrends} />
              </CardBody>
            </Card>
          </div>

          <div className="TableContainer">
            <Card>
              <UiTable data={data.tableData} />
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
