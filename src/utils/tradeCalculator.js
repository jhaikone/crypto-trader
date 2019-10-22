import Bigjs from "big.js";

const tradeCalculator = {
  getProfits: (capital, trades) => {
    return 0;
  },
  getTradeBalances: (balances, capital) => {
    const tradeBalances = [];
    balances.forEach(balance => {
      const cap = capital.find(x => x.currency === balance.currency);
      if (!cap || Number(cap.total) === 0) return;
      const profit = new Bigjs(cap.total).plus(new Bigjs(balance.total));
      const percentage = profit
        .div(new Bigjs(cap.total))
        .minus(new Bigjs(1))
        .times(100);
      const precision = percentage.valueOf().indexOf(".");
      tradeBalances.push({
        currency: cap.currency,
        startingTotal: cap.total,
        total: profit.valueOf(),
        profitGain: balance.total,
        profitPercentage: percentage.toPrecision(precision)
      });
    });
    return tradeBalances;
  }
};

export default tradeCalculator;
