import React, { Component } from 'react';
import Wrapper from './Wrapper';
import { Redirect } from "react-router-dom";
import { fetchUser } from './actions';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state
};

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

    this.props.dispatch(
      fetchUser(
        username,
        password,
      )
    );
  }

  render() {
    if(this.props.user.length > 0) {
      return <Redirect to='/charts' />
    } else {
        return (
          <div className="login-wrapper">
            <form onSubmit={this.login} className="form-signin">
              <h1 style={{textAlign: "center"}} className="h3 mb-3 font-weight-normal">Sign-in to Pluckr</h1>
              <label className="sr-only">Username</label>
              <input ref={this.usernameRef} type="text" name="username" className="form-control" placeholder="Username" required="" autofocus="" />
              <label className="sr-only">Password</label>
              <input ref={this.passwordRef} type="password" id="inputPassword" className="form-control" placeholder="Password" name="password" required="" />
              <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
              <p className="mt-5 mb-3 text-muted">© Pluckr {new Date().getFullYear()}</p>
            </form>
          </div>
        );
    }
  }
}

export default connect(mapStateToProps)(Login);