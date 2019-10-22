import { combineReducers } from "redux";
import tradesReducer from "./tradesReducer";

export default combineReducers({
  trades: tradesReducer
});
