import React, { Component } from 'react';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import chartConfigReducers from './reducers'
import Auth from './Auth';
import Wrapper from './Wrapper';
import Login from './Login';
import Register from './Register';
import { toast } from 'react-toastify';
import Notifications from './builder_components/notifications/Notifications';
import 'react-toastify/dist/ReactToastify.css';
import 'font-awesome/css/font-awesome.min.css'

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

toast.configure()

const store = createStore(
  chartConfigReducers,
  composeEnhancer(
    applyMiddleware(thunkMiddleware),
  ),
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
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route path="/charts" component={Wrapper} />
            <Route path="/account" component={Wrapper} />
            <Route path="/authenticate" component={Auth} />
          </Switch>
        </Router>
        <Notifications />
      </Provider>
    );
  }
}

export default App;
