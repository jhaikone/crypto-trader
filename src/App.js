import React from "react";
import "./App.css";
import { Header } from "./components/Header";
import { BrowserRouter as Router, Route } from "react-router-dom";
import thunk from "redux-thunk";

import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "./reducers/rootReducer";
import TradeContainer from "./routes/home/TradeContainer";

const store = createStore(
  rootReducer,
  undefined,
  compose(applyMiddleware(thunk))
);

const Index = () => <Header />;

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Route path="/" component={Index} />
          <Route path="/home/" component={TradeContainer} />
        </Router>
      </div>
    </Provider>
  );
}

export default App;
