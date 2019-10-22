import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import thunk from "redux-thunk";

import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "./reducers/rootReducer";
import DashboardContainer from "./routes/dashboard/DashboardContainer";

const store = createStore(
  rootReducer,
  undefined,
  compose(applyMiddleware(thunk))
);

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Route path="/" component={DashboardContainer} />
        </Router>
      </div>
    </Provider>
  );
}

export default App;
