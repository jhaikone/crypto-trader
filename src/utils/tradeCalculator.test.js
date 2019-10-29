import tradeCalculator from "./tradeCalculator";
import mockBalances from "../assets/mock-data/mockBalances.json";
import mockTrades from "../assets/mock-data/mockTrades.json";

const mockSteps = {
  Trades: [
    {
      Type: "BUY",
      Total: "1.00",
      OrderPrice: "0.0005",
      OrderAmount: "2817.18",
      AvgTradingPrice: "0.0005",
      Status: "Filled",
      Date: "2019-08-05 14:49:57",
      Filled: "2002.81718",
      BuyData: {
        TotalFee: "2.81718",
        Total: "2000",
        Currency: "AION"
      },
      SellData: { Total: "1.00", Currency: "ETH" },
      FeeCurrency: "AION"
    },
    {
      Type: "SELL",
      Total: "0.6",
      OrderPrice: "0.0006",
      OrderAmount: "1000",
      Filled: "1000",
      AvgTradingPrice: "0.0006",
      Status: "Filled",
      Date: "2019-08-22 19:46:24",
      BuyData: {
        TotalFee: "0.00118033",
        Total: "0.59882",
        Currency: "ETH"
      },
      SellData: { Total: "1000.00", Currency: "AION" },
      FeeCurrency: "ETH"
    },
    {
      Type: "SELL",
      Total: "1.2",
      OrderPrice: "0.0006",
      OrderAmount: "1000",
      Filled: "1000",
      AvgTradingPrice: "0.0012",
      Status: "Filled",
      Date: "2019-08-22 19:46:24",
      BuyData: {
        TotalFee: "0,00236066‬",
        Total: "1.19764",
        Currency: "ETH"
      },
      SellData: { Total: "1000.00", Currency: "AION" },
      FeeCurrency: "ETH"
    }
  ]
};

const mockCapital = [
  {
    currency: "ETH",
    total: "1.00"
  }
];

test("test that profits are calculated correctly", () => {
  const getTradeBalances = tradeCalculator.getTradeBalances(
    mockBalances,
    mockCapital
  );
  const eth = getTradeBalances.find(x => x.currency === "ETH");
  expect(eth.currency).toBe("ETH");
  expect(eth.total).toBe("1.51811888");
  expect(eth.profitGain).toBe("0.51811888");
  expect(eth.startingTotal).toBe("1.00");

  // 1.51811888 / 1 - 1 = 0,51811888 ~ 52
  expect(eth.profitPercentage).toBe("52");
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
