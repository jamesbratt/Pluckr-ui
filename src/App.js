import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route } from "react-router-dom";
import chartConfigReducers from './reducers'
import Builder from './Builder';
import Auth from './Auth';

const store = createStore(
  chartConfigReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chartToEdit: null,
    };
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route exact path="/" component={Builder} />
            <Route path="/authenticate" component={Auth} />
          </div>
        </Router>
      </Provider>

    );
  }
}

export default App;
