import React, { PureComponent } from "react";
import "./App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import thunk from "redux-thunk";

import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "./reducers/rootReducer";
import DashboardContainer from "./routes/dashboard/DashboardContainer";

import background from "./assets/images/background.png";
import { Card } from "./components/ui";

const AppComponent = ({ children }) => (
  <Card>
    <div className="App">{children}</div>
  </Card>
);

const store = createStore(
  rootReducer,
  undefined,
  compose(applyMiddleware(thunk))
);

class App extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <AppComponent>
          <img className="background-image" src={background} alt="background" />
          <Router>
            <Route path="/" component={DashboardContainer} />
          </Router>
        </AppComponent>
      </Provider>
    );
  }
}

export default App;
