import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route } from "react-router-dom";
import chartConfigReducers from './reducers'
import Auth from './Auth';
import Wrapper from './Wrapper';
import pluckrAuthHoc from './pluckrAuthHoc';

const store = createStore(
  chartConfigReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const ChartsAuthChecked = pluckrAuthHoc(
  Wrapper,
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
            <Route exact path="/" component={ChartsAuthChecked} />
            <Route path="/authenticate" component={Auth} />
          </div>
        </Router>
      </Provider>

    );
  }
}

export default App;
