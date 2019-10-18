import { combineReducers } from "redux";
import tradesReducer from "../routes/home/reducers/tradesReducer";

export default combineReducers({
  trades: tradesReducer
});
