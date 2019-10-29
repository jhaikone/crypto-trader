import { combineReducers } from "redux";

const mockTrades = require("../assets/mock-data/mockTrades.json");
const mockBalances = require("../assets/mock-data/mockBalances.json");

export const TYPES = {
  INIT_TRADES: "INIT_TRADES",
  INIT_BALANCES: "INIT_BALANCES"
};

const data = (
  state = {
    balances: mockBalances,
    trades: mockTrades,
    capital: [
      { currency: "ETH", total: "1.160679" },
      { currency: "AION", total: "0" }
    ]
  },
  action
) => {
  switch (action.type) {
    case TYPES.INIT_TRADES: {
      return { ...action.data };
    }
    default: {
      return state;
    }
  }
};

const activeCurrency = (state = "ETH", action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export const actions = {
  initTrades: data => {
    return dispatch => {
      dispatch({
        type: TYPES.INIT_TRADES,
        data
      });
    };
  }
};

export default combineReducers({
  data,
  activeCurrency
});
