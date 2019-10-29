import React from "react";
import { TitleCard } from "./components/TitleCard";
import tradeCalculator from "../../utils/tradeCalculator";
import { Card, CardHeader, GridSpace, CardBody } from "../../components/ui";
import Trendline from "./components/Trendline/Trendline";
import chartHelper from "../../utils/chartHelper";
import Barchart from "./components/Barchart/Barchart";
import "./Dashboard.scss";
import Statistics from "./components/Statistics/Statistics";

export const Dashboard = ({ data, activeCurrency }) => {
  const activeData = tradeCalculator.getActiveTradeBalance(
    data,
    activeCurrency
  );
  const activePair = data.trades.find(x => x.Pair.includes(activeCurrency));
  const capital = data.capital.find(x => x.currency === activeCurrency);

  const steps = tradeCalculator.getTrendlineStep(activePair, capital.total);
  const trends = chartHelper.createTradesData(steps);
  const portfolioData = chartHelper.createPortfolioData(capital.total, steps);
  const statistics = chartHelper.createStatisticsData(steps, activeData);

  console.log("data so far", {
    statistics,
    portfolioData,
    trends,
    steps,
    data,
    activeCurrency,
    activeData
  });

  return (
    <React.Fragment>
      <TitleCard data={activeData} />

      <GridSpace orientation={"vertical"} />

      <div className="flex flex-row">
        <div className="LeftContent">
          <Card>
            <CardHeader label="Statistics"></CardHeader>
            <CardBody>
              <Statistics data={statistics} />
            </CardBody>
          </Card>
        </div>

        <GridSpace orientation={"horizontal"} />

        <div className="flex-1">
          <Card>
            <CardHeader label="Portfolio performance"></CardHeader>
            <CardBody>
              <Trendline data={portfolioData} />
            </CardBody>
          </Card>
        </div>
      </div>

      <GridSpace orientation={"vertical"} />

      <Card>
        <CardHeader label="Single Trade Profits"></CardHeader>
        <CardBody>
          <Barchart data={trends} />
        </CardBody>
      </Card>
    </React.Fragment>
  );
};
