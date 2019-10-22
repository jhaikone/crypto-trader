import XLSX from "xlsx";
import BigJs from "big.js";

const TRADING_PAIRS = {
  ETH: "ETH",
  BTC: "BTC"
};

const getTotalMainBalance = (buyTrades, sellTrades) => {
  const totalBuyMainCurrencyBalance = _calculateMainBuyTradeBalance(buyTrades);
  const totalSellMainCurrencyBalance = _calculateMainSellTradeBalance(
    sellTrades
  );
  return totalSellMainCurrencyBalance
    .minus(totalBuyMainCurrencyBalance)
    .valueOf();
};

const getTotalAltBalance = (buyTrades, sellTrades) => {
  const totalBuyAltCurrencyBalance = _calculateAltBuyTradeBalance(buyTrades);
  const totalSellAltCurrencyBalance = _calculateAltSellTradeBalance(sellTrades);

  return totalBuyAltCurrencyBalance
    .minus(totalSellAltCurrencyBalance)
    .valueOf();
};

const _calculateMainBuyTradeBalance = buyTrades => {
  return _calculateBalance(buyTrades, "SellData");
};

const _calculateMainSellTradeBalance = sellTrades => {
  return _calculateBalance(sellTrades, "BuyData");
};

const _calculateAltBuyTradeBalance = buyTrades => {
  return _calculateBalance(buyTrades, "BuyData");
};

const _calculateAltSellTradeBalance = sellTrades => {
  return _calculateBalance(sellTrades, "SellData");
};

const _calculateBalance = (trades, type) => {
  if (!trades || !trades.length) return 0;
  if (!type) return 0;

  return trades.reduce((currentValue, trade) => {
    const o = trade[type];
    if (!o) return new BigJs(currentValue);
    return new BigJs(currentValue).plus(o.Total);
  }, 0);
};

const createPairs = trades => {
  return trades.map(x => {
    return {
      Pair: x.Pair,
      buyTrades: x.Trades.filter(x => x.Type === "BUY"),
      sellTrades: x.Trades.filter(x => x.Type === "SELL")
    };
  });
};

const removeWhiteSpacesFromObjectKeys = array => {
  array.forEach((row, index) => {
    Object.keys(row).forEach(rowKey => {
      if (rowKey.includes(" ")) {
        const arr = rowKey.split(" ");
        let newKey = `${arr[0]}${arr[1]}`;
        row[newKey] = row[rowKey];
        delete row[rowKey];
      }
    });
  });
};

const createTradePairStacks = trades => {
  const array = [];

  const _trades = trades.map(trade => {
    trade.Status = trade.status;
    trade.Date = trade["Date(UTC)"];
    delete trade["Date(UTC)"];
    delete trade.status;
    return trade;
  });

  _trades.forEach((row, index) => {
    if (row.Status === "Filled") {
      const mainTradeObject = { ...row, Transactions: [] };
      let stillInSameTradeStack = true;
      let i = 2;

      while (stillInSameTradeStack) {
        const trade = trades[index + i];
        if (trade && !trade.Status) {
          mainTradeObject.Transactions.push({
            Fee: trade.AvgTradingPrice,
            Total: trade.OrderAmount,
            Filled: trade.OrderPrice,
            TradingPrice: trade.Type,
            Date: trade.Pair
          });
          i++;
        } else {
          stillInSameTradeStack = false;
        }
      }

      let FeeCurrency;
      let TotalFee = mainTradeObject.Transactions.reduce(
        (currentValue, trade) => {
          let value = new BigJs(trade.Fee.replace(/[^\d.-]/g, ""));
          if (!FeeCurrency) {
            FeeCurrency = trade.Fee.replace(/[0-9.]/g, "");
          }
          return value.add(currentValue);
        },
        0
      );

      const BuyData = TRADING_PAIRS[FeeCurrency]
        ? TRADING_PAIRS[FeeCurrency]
        : FeeCurrency;

      let sellCurrency;

      Object.keys(TRADING_PAIRS).forEach(key => {
        if (
          mainTradeObject.Pair.includes(key) &&
          mainTradeObject.Type === "BUY"
        ) {
          sellCurrency = key;
        }
      });

      mainTradeObject.BuyData = {
        TotalFee: TotalFee.valueOf(),
        Total:
          mainTradeObject.Type === "BUY"
            ? new BigJs(mainTradeObject.Filled).minus(TotalFee).valueOf()
            : new BigJs(mainTradeObject.Total).minus(TotalFee).valueOf(),
        Currency: BuyData
      };

      mainTradeObject.SellData =
        mainTradeObject.Type === "BUY"
          ? {
              Total: mainTradeObject.Total,
              Currency: sellCurrency
            }
          : {
              Total: mainTradeObject.Filled,
              Currency: mainTradeObject.Pair.split(BuyData)[0]
            };

      mainTradeObject.FeeCurrency = FeeCurrency;

      array.push(mainTradeObject);
    }
  });

  return array;
};

const getValidTrades = originalArray => {
  const appendedData = createTradePairStacks(originalArray);
  let foundFirstBuyOrder = false;
  return appendedData
    .reverse()
    .map(tradeRow => {
      if (foundFirstBuyOrder === false && tradeRow.Type === "SELL") {
        return null;
      } else {
        foundFirstBuyOrder = true;
        return { ...tradeRow };
      }
    })
    .filter(x => x);
};

const _getTradingPairs = filteredList => {
  const pairs = [];
  filteredList.forEach(row => {
    const alreadyInList = pairs.find(x => x === row.Pair);
    if (alreadyInList) return;
    pairs.push(row.Pair);
  });
  return pairs;
};

const createTradesByPair = filteredList => {
  const tradingPairs = _getTradingPairs(filteredList);

  return tradingPairs.map(pair => {
    let object = { Pair: pair };
    return {
      ...object,
      Trades: filteredList.filter(x => x.Pair === pair)
    };
  });
};

const createJSONfromWorkbook = workbook => {
  let array = [];

  workbook.SheetNames.forEach(sheetName => {
    array.push(...XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]));
  });

  removeWhiteSpacesFromObjectKeys(array);

  const filteredList = getValidTrades(array);

  const trades = createTradesByPair(filteredList);

  const balancePairs = createPairs(trades);

  let tradingBalances = [];

  balancePairs.forEach(pair => {
    const totalMainBalance = getTotalMainBalance(
      pair.buyTrades,
      pair.sellTrades
    );

    const mainTradingCurrencybalance = {
      currency: pair.buyTrades[0].SellData.Currency,
      total: totalMainBalance
    };

    tradingBalances.push(mainTradingCurrencybalance);

    const totalAltBalance = getTotalAltBalance(pair.buyTrades, pair.sellTrades);

    const altTradingCurrencybalance = {
      currency: pair.sellTrades[0].SellData.Currency,
      total: totalAltBalance
    };

    tradingBalances.push(altTradingCurrencybalance);
  });

  return { balances: tradingBalances, trades };
};

export const fileConverter = {
  xlsxToJson: (file, onDone) => {
    const reader = new FileReader();
    reader.onload = event => {
      const { result } = event.target;
      const workbook = XLSX.read(result, { type: "binary" });

      const json = createJSONfromWorkbook(workbook);

      onDone(json);
    };

    reader.onerror = err => {
      console.error("error on loading file", err);
    };

    reader.readAsBinaryString(file);
  }
};
