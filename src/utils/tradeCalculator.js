import Bigjs from "big.js";

const roundWithOffset = (number, increment, offset) => {
  return Math.ceil((number - offset) / increment) * increment + offset;
};

const _getPercentage = (a, b) => {
  return Bigjs(a)
    .div(new Bigjs(b))
    .minus(new Bigjs(1))
    .times(100);
};

const getTradePercentage = (priceA, priceB) => {
  return Bigjs(priceA)
    .div(priceB)
    .minus(1);
};

const getPositionPercentage = (buyPosition, sellPosition) => {
  return Bigjs(buyPosition).div(sellPosition);
};

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
      const percentage = _getPercentage(profit, cap.total);
      const precision = percentage.valueOf().indexOf(".");
      tradeBalances.push({
        currency: cap.currency,
        startingTotal: cap.total,
        total: profit.valueOf(),
        profitGain: balance.total,
        profitPercentage: percentage.toPrecision(precision + 2)
      });
    });
    return tradeBalances;
  },
  getActiveTradeBalance: (data, activeCurrency) => {
    const { balances, capital } = data;
    const trades = tradeCalculator.getTradeBalances(balances, capital);
    if (!trades || !trades.length) return {};
    return trades.find(x => x.currency === activeCurrency) || {};
  },
  getTrendlinePercentages: profitPercentage => {
    const rawDividerNumber = Math.abs(Number(profitPercentage) / 6);
    const value = new Intl.NumberFormat("us-Us", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(roundWithOffset(rawDividerNumber, 5, 5));
    return value;
  },
  getTrendlineStep: (activePair, startingCap) => {
    const steps = [];
    let cap = Bigjs(startingCap);
    const buys = activePair.Trades.filter(x => x.Type === "BUY")
      .map(x => {
        const sellTotal = Bigjs(x.SellData.Total);
        cap = sellTotal > cap ? sellTotal : cap;
        return {
          price: Bigjs(x.SellData.Total)
            .div(x.BuyData.Total)
            .valueOf(),
          total: x.BuyData.Total,
          date: x.Date,
          capitalWeight: sellTotal.div(cap).valueOf()
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    const sells = activePair.Trades.filter(x => x.Type === "SELL")
      .map(x => {
        return {
          price: Bigjs(x.BuyData.Total)
            .div(x.SellData.Total)
            .valueOf(),
          total: x.SellData.Total,
          date: x.Date
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    let total = 0;
    let i = 0;

    buys.forEach(buyTrade => {
      total = Bigjs(buyTrade.total)
        .plus(total)
        .valueOf();
      while (Number(total) > 0) {
        const sellTrade = sells[i];
        if (!sellTrade) {
          break;
        }
        total = Bigjs(total)
          .minus(sellTrade.total)
          .valueOf();

        const tradePercentage = getTradePercentage(
          sellTrade.price,
          buyTrade.price
        );

        const positionPercentage = getPositionPercentage(
          sellTrade.total,
          buyTrade.total
        );

        const percentage = tradePercentage.times(positionPercentage).valueOf();
        steps.push({
          totalPercentage: percentage,
          tradePercentage: tradePercentage.valueOf(),
          dateIn: buyTrade.date,
          dateOut: sellTrade.date,
          capitalWeight: buyTrade.capitalWeight,
          capitalTradePercentage: tradePercentage
            .times(buyTrade.capitalWeight)
            .valueOf()
        });
        i++;
      }
    });

    return steps;
  }
};

export default tradeCalculator;
