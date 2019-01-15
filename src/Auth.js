import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { EASY_OAUTH_AUTH_ENDPOINT } from './Constants';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  componentDidMount() {
    const params = window.location.search;

    if (params.length > 0) {
      fetch(EASY_OAUTH_AUTH_ENDPOINT + params)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          if (!response.errors) {
            localStorage.setItem('token', response.access_token);
            this.setState({isAuthenticated: true});
          } else {
            console.error(response);
          }
        })
    }
  }

  render() {
    if(this.state.isAuthenticated === true) {
      return <Redirect
        to={{
          pathname: "/",
          state: { isAuthenticated: true }
        }}
      />
    } else {
      return null;
    }
  }
}

export default Auth;