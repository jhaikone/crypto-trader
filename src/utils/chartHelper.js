import Bigjs from "big.js";
import formatter from "./formatter";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import parseISO from "date-fns/parseISO";
import formatDistance from "date-fns/formatDistance";

/* 

 
        <RowItem title="Absolute gain" label="0.5 ETH" />
        <RowItem margin title="Profit" label="24.52%" />
 
        <RowItem title="Total trades" label="12" />
        <RowItem margin title="Success Trades" label="24.52%" />
 
        <RowItem title="Avg. trade duration" label="3 days" />

*/

const chartHelper = {
  getLineChartDefaults: () => {
    return {
      margin: { top: 5, right: 16, bottom: 5, left: 0 },
      height: 280
    };
  },
  createTradesData: steps => {
    return steps.map(x => {
      return {
        value: Number(x.tradePercentage) * 100
      };
    });
  },
  createStatisticsData: (steps, activeData) => {
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
      .round()
      .times(24)
      .valueOf();

    const dateAverage = formatDistance(
      new Date().setHours(Number(hours)),
      new Date()
    );
    return {
      header: "Past Quarter",
      rows: [
        {
          id: "row-1",
          items: [
            {
              id: "23423423-f23f23f23f-3f23f23f2-f23f23f32f",
              title: "Absolute Gain",
              value: `${formatter.formatCurrency(activeData.profitGain)} ${
                activeData.currency
              }`
            },
            {
              id: "23423423-wefwefwefwe-wefwefwefwf-wefwefwefwef",
              title: "Profit",
              value: `${activeData.profitPercentage}%`
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
  createPortfolioData: (capital, steps) => {
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
  }
};

export default chartHelper;
