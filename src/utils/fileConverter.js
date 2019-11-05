import XLSX from "xlsx";
import BigJs from "big.js";
import chartHelper from "./chartHelper";

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
  return _calculateBalance(buyTrades, "sellData");
};

const _calculateMainSellTradeBalance = sellTrades => {
  return _calculateBalance(sellTrades, "buyData");
};

const _calculateAltBuyTradeBalance = buyTrades => {
  return _calculateBalance(buyTrades, "buyData");
};

const _calculateAltSellTradeBalance = sellTrades => {
  return _calculateBalance(sellTrades, "sellData");
};

const _calculateBalance = (trades, type) => {
  if (!trades || !trades.length) return 0;
  if (!type) return 0;

  return trades.reduce((currentValue, trade) => {
    const o = trade[type];
    if (!o) return new BigJs(currentValue);
    return new BigJs(currentValue).plus(o.total);
  }, 0);
};

const createPairs = trades => {
  return trades.map(x => {
    return {
      pair: x.pair,
      buyTrades: x.trades.filter(x => x.type === "BUY"),
      sellTrades: x.trades.filter(x => x.type === "SELL")
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
    trade.date = trade["Date(UTC)"];
    delete trade["Date(UTC)"];
    return trade;
  });

  _trades.forEach((row, index) => {
    if (row.status === "Filled") {
      const newObj = objectToLowerCase(row);

      const mainTradeObject = { ...newObj, transactions: [] };
      let stillInSameTradeStack = true;
      let i = 2;

      while (stillInSameTradeStack) {
        const trade = trades[index + i];
        if (trade && !trade.status) {
          mainTradeObject.transactions.push({
            fee: trade.AvgTradingPrice,
            total: trade.OrderAmount,
            filled: trade.OrderPrice,
            tradingPrice: trade.Type,
            date: trade.Pair
          });
          i++;
        } else {
          stillInSameTradeStack = false;
        }
      }

      let feeCurrency;
      let totalFee = mainTradeObject.transactions.reduce(
        (currentValue, trade) => {
          let value = new BigJs(trade.fee.replace(/[^\d.-]/g, ""));
          if (!feeCurrency) {
            feeCurrency = trade.fee.replace(/[0-9.]/g, "");
          }
          return value.add(currentValue);
        },
        0
      );

      const BuyData = TRADING_PAIRS[feeCurrency]
        ? TRADING_PAIRS[feeCurrency]
        : feeCurrency;

      let sellCurrency;

      Object.keys(TRADING_PAIRS).forEach(key => {
        if (
          mainTradeObject.pair.includes(key) &&
          mainTradeObject.type === "BUY"
        ) {
          sellCurrency = key;
        }
      });

      mainTradeObject.buyData = {
        totalFee: totalFee.valueOf(),
        total:
          mainTradeObject.type === "BUY"
            ? new BigJs(mainTradeObject.filled).minus(totalFee).valueOf()
            : new BigJs(mainTradeObject.total).minus(totalFee).valueOf(),
        currency: BuyData
      };

      mainTradeObject.sellData =
        mainTradeObject.type === "BUY"
          ? {
              total: mainTradeObject.total,
              currency: sellCurrency
            }
          : {
              total: mainTradeObject.filled,
              currency: mainTradeObject.pair.split(BuyData)[0]
            };

      mainTradeObject.feeCurrency = feeCurrency;

      array.push(mainTradeObject);
    }
  });

  return array;
};

const getValidTrades = originalArray => {
  return chartHelper.createValidTraidingPairs(
    createTradePairStacks(originalArray).reverse()
  );
};

const _getTradingPairs = filteredList => {
  const pairs = [];
  filteredList.forEach(row => {
    const alreadyInList = pairs.find(x => x === row.pair);
    if (alreadyInList) return;
    pairs.push(row.pair);
  });
  return pairs;
};

const objectToLowerCase = obj => {
  let key,
    keys = Object.keys(obj);
  let n = keys.length;
  const newobj = {};
  while (n--) {
    key = keys[n];
    const newKey = toCamelCase(key);
    newobj[newKey] = obj[key];
    if (newKey === "sellData" || newKey === "buyData") {
      newobj[newKey] = objectToLowerCase(newobj[newKey]);
    }
  }
  return newobj;
};

const createTradesByPair = filteredList => {
  const tradingPairs = _getTradingPairs(filteredList);

  return tradingPairs.map(pair => {
    let object = { pair: pair };
    return {
      ...object,
      trades: filteredList.filter(x => x.pair === pair)
    };
  });
};

const toCamelCase = string => {
  if (!string) return "";
  const first = string[0].toLowerCase();
  const lastpart = string.slice(1, string.length);
  return `${first}${lastpart}`;
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
      currency: pair.buyTrades[0].sellData.currency,
      total: totalMainBalance
    };

    tradingBalances.push(mainTradingCurrencybalance);

    const totalAltBalance = getTotalAltBalance(pair.buyTrades, pair.sellTrades);

    const altTradingCurrencybalance = {
      currency: pair.sellTrades[0].sellData.currency,
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
