import { combineReducers } from "redux";
import Bigjs from "big.js";
import chartHelper from "../utils/chartHelper.js";

export const TYPES = {
  INIT_TRADES: "INIT_TRADES",
  INIT_BALANCES: "INIT_BALANCES",
  CHANGE_FILTER: "CHANGE_FILTER"
};

const data = (
  state = {
    balances: [],
    trades: [],
    capital: [
      { currency: "ETH", startingTotal: "1.160679" },
      { currency: "AION", startingTotal: "0" }
    ],
    dashboard: {}
  },
  action
) => {
  switch (action.type) {
    case TYPES.INIT_TRADES: {
      const wallet = (action.data.balances || []).map(balance => {
        const find = state.capital.find(c => c.currency === balance.currency);
        if (find && balance.total) {
          return {
            ...find,
            total: Bigjs(balance.total)
              .plus(find.startingTotal)
              .valueOf()
          };
        } else {
          return {
            ...balance
          };
        }
      });

      const { activeCurrency, filter } = action;

      const data = { ...state, trades: action.data.trades, balances: wallet };
      data.dashboard = chartHelper.createDashboardData(
        data,
        activeCurrency,
        filter
      );

      return { ...data };
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

const filters = (state = chartHelper.getDefaultFilters(), action) => {
  switch (action.type) {
    case TYPES.CHANGE_FILTER: {
      const filter = action.filter;
      return state.map(x => {
        return {
          ...x,
          active: filter.value === x.value
        };
      });
    }
    default: {
      return state;
    }
  }
};

export const actions = {
  initTrades: data => {
    return (dispatch, getState) => {
      const { activeCurrency, filters } = getState().trades;
      dispatch({
        type: TYPES.INIT_TRADES,
        data,
        activeCurrency,
        filter: filters.find(x => x.active)
      });
    };
  },
  changeFilter: filter => {
    return dispatch => {
      dispatch({
        type: TYPES.CHANGE_FILTER,
        filter
      });
    };
  }
};

export default combineReducers({
  data,
  activeCurrency,
  filters
});
