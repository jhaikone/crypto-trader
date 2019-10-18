import { connect } from "react-redux";
import { actions as tradesActions, TYPES } from "./reducers/tradesReducer";
import Home from "./Home";

const mapDispatchToProps = dispatch => {
  return {
    onInitTrades: trades => {
      dispatch(tradesActions.initTrades(trades));
    }
  };
};

const mapStateToProps = (state, ownProps) => {
  const { list, balance } = state.trades;
  return {
    list,
    balance
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
