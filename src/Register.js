import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { addNotification } from './actions/notification';

const emailRef = React.createRef();
const passwordRef = React.createRef();
const passwordConfirmRef = React.createRef();

class Register extends React.Component {
  state = {
    hasRegisted: false,
  }

  register = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirm = passwordConfirmRef.current.value;

    if (password !== confirm) {
      this.props.dispatch(addNotification({ message: 'Password and password confirmation must match', type: 'error' }));
    } else {
      return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/signup/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, raw_password: password })
      })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if(!response.error) {
          this.setState({ hasRegisted: true });
        } else {
          this.props.dispatch(addNotification({ message: response.error.message, type: 'error' }));
        }
      })
      .catch(error => this.props.dispatch(addNotification({ message: error.message, type: 'error' })));
    }

  }

  render() {
    if (this.state.hasRegisted) {
      return <Redirect to={{
        pathname: '/',
        state: { alert: 'Awesome! You are now registered for 30 days as a beta tester. You can now sign-in to Pluckr and get started!' }
      }} />
    }
    return (
      <div className="login-wrapper">
        <div className="form-register">
          <h1 style={{textAlign: "center"}} className="h3 mb-3 font-weight-normal">Register as a Beta Tester</h1>
          <p>To make Pluckr the best it can be, we need feedback from users. Your beta test account will be active for 30 days, after which your feedback will be requested.</p>
          <div className="form-group">
            <label>Email Address</label>
            <input ref={emailRef} className="form-control" type="email" placeholder="Please enter your email address" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input ref={passwordRef} className="form-control" type="password" placeholder="Please enter a password" />
          </div>
          <div className="form-group">
            <label>Password Confirmation</label>
            <input ref={passwordConfirmRef} className="form-control" type="password" placeholder="Confirm your password" />
          </div>
          <button onClick={this.register} className="btn btn-lg btn-primary" type="submit">Register</button>
          <p className="mt-5 mb-3 text-muted">Already registered? Sign-in <a href="/">here</a></p>
          <p className="mt-5 mb-3 text-muted">© Pluckr {new Date().getFullYear()}</p>
        </div>
      </div>
    )
  }
}

export default connect()(Register);