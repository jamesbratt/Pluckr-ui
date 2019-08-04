import React, { Component } from 'react';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import chartConfigReducers from './reducers'
import Auth from './Auth';
import Wrapper from './Wrapper';
import pluckrAuthHoc from './pluckrAuthHoc';
import ChartConfigHoc from './ChartConfigHoc';
import Chart from './builder_components/editor/Chart';
import DataSourceList from './builder_components/data_sources/DataSourceList';
import DataSourceDetail from './builder_components/data_sources/DataSourceDetail';
import Login from './Login';
import Nav from 'react-bootstrap/Nav';
import './css/builder.css';
import 'font-awesome/css/font-awesome.min.css'

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

const DataSourceListWrapped = ChartConfigHoc(DataSourceList);
const DataSourceDetailWrapped = ChartConfigHoc(DataSourceDetail);
const ChartEditorWrapped = ChartConfigHoc(Chart);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chartToEdit: null,
    };
  }

  render() {
    const tokenObj = localStorage.getItem('pluckr_token');
    return (
      <Provider store={store}>
        <Router>
          <React.Fragment>
            <Route path="/" render={() =>(
              tokenObj ? ( <Route component={Wrapper} />)
              : (<Route component={Login} />)
            )} />
            <Route path="/authenticate" component={Auth} />
          </React.Fragment>
        </Router>
      </Provider>

    );
  }
}

export default App;
