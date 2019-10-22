import tradeCalculator from "./tradeCalculator";
import mockBalances from "../assets/mock-data/mockBalances.json";

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
