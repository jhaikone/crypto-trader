import { connect } from "react-redux";
import { actions as tradesActions } from "../../../reducers/tradesReducer";
import InsertBalance from "./InsertBalance";

const mapDispatchToProps = dispatch => {
  return {
    onFileLoaded: data => {
      dispatch(tradesActions.initTrades(data));
    }
  };
};

const mapStateToProps = state => {
  const { data } = state.trades;
  return {
    data
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InsertBalance);
