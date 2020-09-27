import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from "react-router-dom";
import { fetchUser } from './actions';
import { connect } from 'react-redux';
import './css/login.css'

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
              {this.props.location.state ? <Alert variant='success'>{this.props.location.state.alert}</Alert> : null}
              <h1 style={{textAlign: "center"}} className="h3 font-weight-normal">Sign-in to Pluckr</h1>
              <label className="sr-only">Username</label>
              <input ref={this.usernameRef} type="text" name="username" className="form-control" placeholder="Enter your username" required="" autofocus="" />
              <label className="sr-only">Password</label>
              <input ref={this.passwordRef} type="password" id="inputPassword" className="form-control" placeholder="Enter your password" name="password" required="" />
              <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
              <p className="text-muted"><a href="/register">Sign Up</a></p>
              <p className="text-muted">© Pluckr {new Date().getFullYear()}</p>
            </form>
          </div>
        );
    }
  }
}

export default connect(mapStateToProps)(Login);