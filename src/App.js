import React, { Component } from 'react';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter as Router, Route } from "react-router-dom";
import chartConfigReducers from './reducers'
import Auth from './Auth';
import Wrapper from './Wrapper';
import pluckrAuthHoc from './pluckrAuthHoc';
import './css/builder.css';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  chartConfigReducers,
  composeEnhancer(
    applyMiddleware(thunkMiddleware),
  ),
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
          <React.Fragment>
            <Route exact path="/" component={ChartsAuthChecked} />
            <Route path="/authenticate" component={Auth} />
          </React.Fragment>
        </Router>
      </Provider>

    );
  }
}

export default App;
