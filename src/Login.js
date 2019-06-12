import React, { Component } from 'react';
import Wrapper from './Wrapper';

class Login extends Component {
  constructor(props) {
    super(props);
    this.usernameRef = React.createRef();
    this.passwordRef = React.createRef();
    this.state = {
      isAuthenticatedWithPluckr: false
    };
  }

  login = (e) => {
    e.preventDefault();
    const username = this.usernameRef.current.value;
    const password = this.passwordRef.current.value;

    fetch('https://api.pluckr.io/api/v1/authentication/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
        localStorage.setItem('pluckr_token', JSON.stringify(response['api_key']));
        this.setState({ isAuthenticatedWithPluckr: true })
    })
  }

  render() {
    if(this.state.isAuthenticatedWithPluckr) {
      return <Wrapper />
    } else {
        return (
            <form onSubmit={this.login}>
                <div>
                    <label>Username</label>
                    <input ref={this.usernameRef} type="text" name="username" />
                </div>
                <div>
                    <label>Password</label>
                    <input ref={this.passwordRef} type="password" name="password" />
                </div>
                <button type="submit">Sign In</button>
            </form>
        );
    }
  }
}

export default Login;