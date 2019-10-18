import { combineReducers } from "redux";
import BigJs from "big.js";

export const TYPES = {
  INIT_TRADES: "INIT_TRADES"
};

const list = (state = [], action) => {
  switch (action.type) {
    case TYPES.INIT_TRADES: {
      return [...state, ...action.trades];
    }
    default: {
      return state;
    }
  }
};

const balance = (
  state = [{ currency: "ETH", Balance: 0 }, { currency: "BTC", Balance: 0 }],
  action
) => {
  switch (action.type) {
    case TYPES.INIT_TRADES: {
      const pairs = action.trades
        .map(x => {
          return {
            Pair: x.Pair,
            buyTrades: x.trades.filter(x => x.Type === "BUY"),
            sellTrades: x.trades.filter(x => x.Type === "SELL")
          };
        })
        .filter(x => x.Pair.includes("ETH") || x.Pair.includes("BTC"));

      let tradingBalances = [];

      pairs.forEach(pair => {
        let totalSellMainCurrencyBalance = pair.buyTrades.reduce(
          (currentValue, trade) => {
            return new BigJs(currentValue).plus(trade.SellCurrency.Total);
          },
          0
        );

        let totalBuyMainCurrencyBalance = pair.sellTrades.reduce(
          (currentValue, trade) => {
            return new BigJs(currentValue).plus(trade.BuyCurrency.Total);
          },
          0
        );

        const mainTradingCurrencybalance = {
          currency: pair.buyTrades[0].SellCurrency.Currency,
          total: totalBuyMainCurrencyBalance
            .minus(totalSellMainCurrencyBalance)
            .valueOf()
        };

        tradingBalances.push(mainTradingCurrencybalance);

        const altSellBalance = pair.buyTrades.reduce((currentValue, trade) => {
          return new BigJs(currentValue).plus(trade.BuyCurrency.Total);
        }, 0);

        const altBuyBalance = pair.sellTrades.reduce((currentValue, trade) => {
          return new BigJs(currentValue).plus(trade.SellCurrency.Total);
        }, 0);

        const altTradingCurrencybalance = {
          currency: pair.sellTrades[0].SellCurrency.Currency,
          total: altSellBalance.minus(altBuyBalance).valueOf()
        };

        tradingBalances.push(altTradingCurrencybalance);
      });
      return [...tradingBalances];
    }
    default: {
      return state;
    }
  }
};

export const actions = {
  initTrades: trades => {
    return dispatch => {
      dispatch({
        type: TYPES.INIT_TRADES,
        trades
      });
    };
  }
};

export default combineReducers({
  list,
  balance
});
