import Bigjs from "big.js";
import formatter from "./formatter";
import parseISO from "date-fns/parseISO";
import formatDistance from "date-fns/formatDistance";

import mockBalances from "../assets/mock-data/mockBalances.json";
import mockTrades from "../assets/mock-data/mockTrades.json";

import {
  format,
  differenceInCalendarMonths,
  differenceInCalendarDays
} from "date-fns";
import tradeCalculator from "./tradeCalculator";

const tableLabels = [
  { name: "Date", priority: 2 },
  { name: "Pair", priority: 1 },
  { name: "Type", priority: 1 },
  { name: "Price", priority: 1 },
  { name: "Filled", priority: 2 },
  { name: "Total", priority: 1 }
];

const defaultFilters = [
  { value: 3, label: "3M", active: true, header: "Past Quarter" },
  { value: 6, label: "6M", active: false, header: "Past Six Months" },
  { value: 12, label: "1Y", active: false, header: "Last Year" },
  { value: -1, label: "All time", active: false, header: "All Time" }
];

const hasValidData = data => {
  return !(
    Object.keys(data.dashboard).length === 0 || data.trades.length === 0
  );
};

const _withinRange = (trade, filter) => {
  const difference = differenceInCalendarMonths(
    Date.now(),
    parseISO(trade.date)
  );
  return difference <= filter.value;
};

const getFilteredTrades = (data, filter) => {
  return data.trades.map(tradeStack => {
    return {
      ...tradeStack,
      trades: chartHelper.createValidTraidingPairs(
        tradeStack.trades.filter(
          item => filter.value < 0 || _withinRange(item, filter)
        )
      )
    };
  });
};

const chartHelper = {
  getDefaultFilters: () => {
    return defaultFilters;
  },
  getMockData: () => {
    return {
      balances: mockBalances,
      trades: mockTrades
    };
  },
  getLineChartDefaults: () => {
    return {
      margin: { top: 5, right: 16, bottom: 10, left: 0 },
      height: 280
    };
  },
  getTableData: trades => {
    let currentPair = "";
    const rows = trades.map(tradeStack => {
      currentPair = tradeStack.pair;
      return tradeStack.trades.map(trade => {
        const { type, avgTradingPrice, filled } = trade;
        const total =
          trade.type === "BUY"
            ? `${trade.buyData.total} ${trade.buyData.currency}`
            : `${trade.sellData.total} ${trade.sellData.currency}`;
        return [
          format(new Date(trade.date), "dd.MM.yyyy"),
          currentPair,
          type,
          avgTradingPrice,
          filled,
          total
        ];
      });
    });

    return rows.flat();
  },
  createValidTraidingPairs: trades => {
    let foundFirstBuyOrder = false;
    return trades
      .map(tradeRow => {
        if (foundFirstBuyOrder === false && tradeRow.type === "SELL") {
          return null;
        } else {
          foundFirstBuyOrder = true;
          return { ...tradeRow };
        }
      })
      .filter(x => x);
  },
  createTradesData: steps => {
    return steps.map(x => {
      return {
        value: Number(x.tradePercentage) * 100
      };
    });
  },
  createStatisticsData: (steps, portfolioPerformance, activeData, filter) => {
    const tradeCount = steps.length;
    const successTrades = steps.filter(x =>
      Number(x.capitalTradePercentage > 0)
    );
    const tradeSuccessPercentage = Bigjs(successTrades.length).div(tradeCount);
    const dates = steps.map(x =>
      differenceInCalendarDays(parseISO(x.dateOut), parseISO(x.dateIn))
    );

    const daysTotal = dates.reduce((current, iterable) => {
      return current + iterable;
    }, 0);

    const hours = Bigjs(daysTotal)
      .div(12)
      .times(24)
      .valueOf();

    const dateAverage = formatDistance(
      new Date().setHours(Number(hours)),
      new Date()
    );
    const lastPerf =
      portfolioPerformance[portfolioPerformance.length - 1].value;
    const absoluteGain = Bigjs(lastPerf)
      .div(Bigjs(100))
      .plus(1)
      .times(Bigjs(activeData.startingTotal))
      .minus(activeData.startingTotal)
      .valueOf();
    const precision = lastPerf.toString().indexOf(".");
    return {
      header: filter.header,
      rows: [
        {
          id: "row-1",
          items: [
            {
              id: "23423423-f23f23f23f-3f23f23f2-f23f23f32f",
              title: "Absolute Gain",
              value: `${formatter.formatCurrency(absoluteGain)} ${
                activeData.currency
              }`
            },
            {
              id: "23423423-wefwefwefwe-wefwefwefwf-wefwefwefwef",
              title: "Profit",
              value: `${lastPerf.toPrecision(precision + 2)}%`
            }
          ]
        },
        {
          id: "row-2",
          items: [
            {
              id: "23423423-hwehwheh-3f23f23f2-fsefef3f3f3f",
              title: "Total Trades",
              value: tradeCount
            },
            {
              id: "sdgegg4g4g-sdfsdfsdf-g343g3g3g-sdfsdfsdf",
              title: "Success Trades",
              value: `${tradeSuccessPercentage.times(100).round(2)}%`
            }
          ]
        },
        {
          id: "row-3",
          items: [
            {
              id: "ffafasf-safasfasf-awfawfaf-f2f2fafs",
              title: "Avg. trade duration",
              value: dateAverage
            }
          ]
        }
      ]
    };
  },
  createPortfolioPerfromance: (capital, steps) => {
    let currentBalance = Bigjs(capital);

    const percentageTrend = steps.map((x, i) => {
      const tradePercentage = Bigjs(1).plus(x.tradePercentage);
      const newBalance = tradePercentage.times(currentBalance);
      const newPercentage = newBalance
        .div(capital)
        .minus(1)
        .times(100)
        .valueOf();
      currentBalance = newBalance;
      return {
        value: Number(newPercentage)
      };
    });
    return percentageTrend;
  },
  toPercentage: value => {
    return `${value}%`;
  },
  createDashboardData: (data, activeCurrency, filter) => {
    if (!hasValidData(data)) {
      return {
        wallet: [],
        tradeTrends: [],
        statistics: {},
        portfolioPerformance: [],
        tableData: {}
      };
    }
    const { balances, capital } = data;

    const filteredTrades = getFilteredTrades(data, filter);

    const activeTradeStack = filteredTrades.filter(x =>
      x.pair.includes(activeCurrency)
    );
    const balance = balances.find(x => x.currency === activeCurrency);
    const steps = tradeCalculator.getTrendlineStep(
      activeTradeStack[0],
      balance.startingTotal
    );

    const portfolioPerformance = chartHelper.createPortfolioPerfromance(
      balance.total,
      steps
    );

    const tradeTrends = chartHelper.createTradesData(steps);
    const activeData = tradeCalculator.getActiveTradeBalance(
      { balances, capital },
      activeCurrency
    );

    const statistics = chartHelper.createStatisticsData(
      steps,
      portfolioPerformance,
      activeData,
      filter
    );

    return {
      wallet: balances,
      tradeTrends,
      statistics,
      portfolioPerformance,
      tableData: {
        rows: chartHelper.getTableData(activeTradeStack),
        labels: tableLabels
      }
    };
  }
};

export default chartHelper;
