import XLSX from "xlsx";
import BigJs from "big.js";

const TRADING_PAIRS = {
  ETH: "ETH",
  BTC: "BTC"
};

const createJSONfromWorkbook = workbook => {
  let array;

  workbook.SheetNames.forEach(sheetName => {
    array = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  });
  const finalData = [];
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

  array.forEach((row, index) => {
    if (row.status === "Filled") {
      const mainTradeObject = { ...row, trades: [] };
      let stillInSameTradeStack = true;
      let i = 2;

      while (stillInSameTradeStack) {
        const trade = array[index + i];
        if (trade && !trade.status) {
          mainTradeObject.trades.push({
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
      let TotalFee = mainTradeObject.trades.reduce((currentValue, trade) => {
        let value = new BigJs(trade.Fee.replace(/[^\d.-]/g, ""));
        if (!FeeCurrency) {
          FeeCurrency = trade.Fee.replace(/[0-9.]/g, "");
        }
        return value.add(currentValue);
      }, 0);

      const BuyCurrency = TRADING_PAIRS[FeeCurrency]
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

      mainTradeObject.BuyCurrency = {
        TotalFee: TotalFee.valueOf(),
        Total:
          mainTradeObject.Type === "BUY"
            ? new BigJs(mainTradeObject.Filled).minus(TotalFee).valueOf()
            : new BigJs(mainTradeObject.Total).minus(TotalFee).valueOf(),
        Currency: BuyCurrency
      };

      mainTradeObject.SellCurrency =
        mainTradeObject.Type === "BUY"
          ? {
              Total: mainTradeObject.Total,
              Currency: sellCurrency
            }
          : {
              Total: mainTradeObject.Filled,
              Currency: mainTradeObject.Pair.split(BuyCurrency)[0]
            };

      mainTradeObject.FeeCurrency = FeeCurrency;

      finalData.push(mainTradeObject);
    }
  });

  let foundFirstBuyOrder = false;

  const filteredList = finalData
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

  const pairs = [];

  filteredList.forEach(row => {
    const alreadyInList = pairs.find(x => x === row.Pair);
    if (alreadyInList) return;
    pairs.push(row.Pair);
  });

  const byTraidingPairs = pairs.map(pair => {
    let object = { Pair: pair };
    return {
      ...object,
      trades: filteredList.filter(x => x.Pair === pair)
    };
  });

  return byTraidingPairs;
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
