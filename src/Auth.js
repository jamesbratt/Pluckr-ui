import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { assocPath } from 'ramda';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state
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
    const url = new URL(window.location);
    const code = decodeURIComponent(url.searchParams.get("code"));

    const user = this.props.user[0].username;
    const apiKey = this.props.user[0].api_key;
    const payload = {
        'integration_type': providerName,
        'integration_payload': {
            'code': code, 
        }
    }

    if (code) {
      fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/integration-auth/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${user}:${apiKey}`
        },
        body: JSON.stringify(payload)
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          if (!response.errors) {
            const tokenObj = localStorage.getItem('token');
            const parsedTokens = tokenObj ? JSON.parse(tokenObj) : {}; 
            const newTokeObj = assocPath([providerName], response, parsedTokens);
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

export default connect(mapStateToProps)(Auth);
