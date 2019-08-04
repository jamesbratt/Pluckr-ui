import React, { Component } from 'react';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import chartConfigReducers from './reducers'
import Auth from './Auth';
import Wrapper from './Wrapper';
import pluckrAuthHoc from './pluckrAuthHoc';
import ChartConfigHoc from './ChartConfigHoc';
import Chart from './builder_components/editor/Chart';
import DataSourceList from './builder_components/data_sources/DataSourceList';
import DataSourceDetail from './builder_components/data_sources/DataSourceDetail';
import Navbar from 'react-bootstrap/Navbar';
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

  logout = () => {
    localStorage.removeItem('pluckr_token');
    window.location.href = "/";
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <React.Fragment>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
              <Navbar.Brand href="/">Pluckr</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                  <Link className="nav-link" to="/">Charts</Link>
                </Nav>
                <Nav>
                  <Nav.Link onClick={this.logout}>Log Out</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <div id='chart-canvas'>
              <div className='container-fluid wrapper'>
                <Route exact path="/" component={ChartsAuthChecked} />
                <Route path="/authenticate" component={Auth} />
                <Route path={`/:id/chart`} component={ChartEditorWrapped} />
                <Route path={`/:id/data-sources`} component={DataSourceListWrapped} />
                <Route path={`/:id/create-data-source`} component={DataSourceDetailWrapped} />
                <Route path={`/:id/edit-data-source/:data_source_id`} component={DataSourceDetailWrapped} />
              </div>
            </div>
          </React.Fragment>
        </Router>
      </Provider>

    );
  }
}

export default App;
