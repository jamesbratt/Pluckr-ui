import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { STRAVA_AUTH_ENDPOINT, GITHUB_AUTH_ENDPOINT } from './Constants';
import { assocPath } from 'ramda';

const PROVIDER_MAP = {
  strava: STRAVA_AUTH_ENDPOINT,
  github: GITHUB_AUTH_ENDPOINT,
};

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  componentDidMount() {
    const urlSegments = window.location.pathname.split('/');
    const providerName = urlSegments[urlSegments.length - 1];
    const providerAuthEndpoint = PROVIDER_MAP[providerName];
    const params = window.location.search;

    if (params.length > 0 && providerAuthEndpoint) {
      fetch(providerAuthEndpoint + params)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          if (!response.errors) {
            const tokenObj = localStorage.getItem('token');
            const parsedTokens = tokenObj ? JSON.parse(tokenObj) : {}; 
            const newTokeObj = assocPath([providerName], response.access_token, parsedTokens);
            localStorage.setItem('token', JSON.stringify(newTokeObj));
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