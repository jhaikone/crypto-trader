import Bigjs from "big.js";

const roundWithOffset = (number, increment, offset) => {
  return Math.ceil((number - offset) / increment) * increment + offset;
};

const _getPercentage = (a, b) => {
  return Bigjs(a)
    .div(Bigjs(b))
    .minus(Bigjs(1))
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
  getTradeBalances: balances => {
    const tradeBalances = [];
    const filtered = balances.filter(
      b => Number(b.startingTotal) > 0 || Number(b.total > 0)
    );
    filtered.forEach(balance => {
      const percentage = _getPercentage(balance.total, balance.startingTotal);
      const precision = percentage.valueOf().indexOf(".");
      tradeBalances.push({
        currency: balance.currency,
        startingTotal: balance.startingTotal,
        total: balance.total,
        profitGain: balance.total,
        profitPercentage: percentage.toPrecision(precision + 2),
        absoluteGain: Bigjs(balance.total)
          .minus(balance.startingTotal)
          .valueOf()
      });
    });
    return tradeBalances;
  },
  getActiveTradeBalance: (data, activeCurrency) => {
    const { balances } = data;
    const trades = tradeCalculator.getTradeBalances(balances);
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
    const buys = activePair.trades
      .filter(x => x.type === "BUY")
      .map(x => {
        const sellTotal = Bigjs(x.sellData.total);
        cap = sellTotal > cap ? sellTotal : cap;
        return {
          price: Bigjs(x.sellData.total)
            .div(x.buyData.total)
            .valueOf(),
          total: x.buyData.total,
          date: x.date,
          capitalWeight: sellTotal.div(cap).valueOf()
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    const sells = activePair.trades
      .filter(x => x.type === "SELL")
      .map(x => {
        return {
          price: Bigjs(x.buyData.total)
            .div(x.sellData.total)
            .valueOf(),
          total: x.sellData.total,
          date: x.date
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
