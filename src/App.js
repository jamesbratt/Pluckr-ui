import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Builder from './Builder';
import Auth from './Auth';

class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Builder} />
          <Route path="/authenticate" component={Auth} />
        </div>
      </Router>
    );
  }
}

export default App;
