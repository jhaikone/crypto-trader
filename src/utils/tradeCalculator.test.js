import tradeCalculator from "./tradeCalculator";
import mockBalances from "../assets/mock-data/mockBalances.json";

const mockSteps = {
  trades: [
    {
      type: "BUY",
      total: "1.00",
      orderPrice: "0.0005",
      orderAmount: "2817.18",
      avgTradingPrice: "0.0005",
      status: "Filled",
      date: "2019-08-05 14:49:57",
      filled: "2002.81718",
      buyData: {
        totalFee: "2.81718",
        total: "2000",
        currency: "AION"
      },
      sellData: { total: "1.00", currency: "ETH" },
      feeCurrency: "AION"
    },
    {
      type: "SELL",
      total: "0.6",
      orderPrice: "0.0006",
      orderAmount: "1000",
      filled: "1000",
      avgTradingPrice: "0.0006",
      status: "Filled",
      date: "2019-08-22 19:46:24",
      buyData: {
        totalFee: "0.00118033",
        total: "0.59882",
        currency: "ETH"
      },
      sellData: { total: "1000.00", currency: "AION" },
      feeCurrency: "ETH"
    },
    {
      type: "SELL",
      total: "1.2",
      orderPrice: "0.0006",
      orderAmount: "1000",
      filled: "1000",
      avgTradingPrice: "0.0012",
      status: "Filled",
      date: "2019-08-22 19:46:24",
      buyData: {
        totalFee: "0,00236066‬",
        total: "1.19764",
        currency: "ETH"
      },
      sellData: { total: "1000.00", currency: "AION" },
      feeCurrency: "ETH"
    }
  ]
};

test("test that profits are calculated correctly", () => {
  const getTradeBalances = tradeCalculator.getTradeBalances(mockBalances);
  const eth = getTradeBalances.find(x => x.currency === "ETH");
  expect(eth.currency).toBe("ETH");
  expect(eth.total).toBe("1.51811888");
  expect(eth.profitGain).toBe("1.51811888");
  expect(eth.startingTotal).toBe("1.00");
  expect(eth.profitPercentage).toBe("51.81");
});

test("test that trendline percentages are calculated correctly", () => {
  expect(tradeCalculator.getTrendlinePercentages(584.444)).toBe("100");
  expect(tradeCalculator.getTrendlinePercentages("100")).toBe("20");
});

test("test that trendline steps are created correctly", () => {
  const steps = tradeCalculator.getTrendlineStep(mockSteps, 1);
  expect(steps.length).toBe(2);
  expect(steps[0].totalPercentage).toBe("0.09882");
  expect(steps[0].tradePercentage).toBe("0.19764");
});
test("test that trendline steps are created correctly with given staring cap", () => {
  const startingCap = "2.00";
  const steps = tradeCalculator.getTrendlineStep(mockSteps, startingCap);
  expect(steps.length).toBe(2);
  expect(steps[0].totalPercentage).toBe("0.09882");
  expect(steps[0].capitalTradePercentage).toBe("0.09882");
  expect(steps[1].capitalTradePercentage).toBe("0.69764");
});
