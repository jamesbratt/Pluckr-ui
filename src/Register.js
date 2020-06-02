import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { addNotification } from './actions/notification';
import './css/login.css'

const usernameRef = React.createRef();
const passwordRef = React.createRef();
const passwordConfirmRef = React.createRef();
const contactCheckRef = React.createRef();
const emailRef = React.createRef();

class Register extends React.Component {
  state = {
    hasRegisted: false,
  }

  register = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const confirm = passwordConfirmRef.current.value;
    const contact = contactCheckRef.current.checked;
    const email = emailRef.current.value;

    if (password !== confirm) {
      this.props.dispatch(addNotification({ message: 'Password and password confirmation must match', type: 'error' }));
    } else {
      return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/signup/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, raw_password: password, contact, email_address: email })
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
        state: { alert: 'Awesome! You are now registered as a beta tester. You can now sign-in to Pluckr and get started!' }
      }} />
    }
    return (
      <div className="login-wrapper">
        <form onSubmit={this.register} className="form-register">
          <h1 style={{textAlign: "center"}} className="h3 mb-3 font-weight-normal">Register as a Beta Tester</h1>
          <p>To make Pluckr the best it can be, user feedback is crucial! Once you have been using Pluckr for a while your feedback will be requested.</p>
          <div className="form-group">
            <label>Username</label>
            <input name="userame" required ref={usernameRef} className="form-control" type="text" placeholder="Please enter a username" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" required ref={emailRef} className="form-control" type="email" placeholder="Please enter your email address" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input required ref={passwordRef} className="form-control" type="password" placeholder="Please enter a password" />
          </div>
          <div className="form-group">
            <label>Password Confirmation</label>
            <input required ref={passwordConfirmRef} className="form-control" type="password" placeholder="Confirm your password" />
          </div>
          <div class="form-check">
            <input required ref={contactCheckRef} class="form-check-input" type="checkbox" />
            <label class="form-check-label">
              By ticking this box you are agreeing to be contacted by Pluckr
            </label>
            <small class="form-text text-muted">
              Don't worry, we will not be using your email address to spam you with junk. It is just for gathering user feedback and to contact you regarding your continued usage of Pluckr.
            </small>
          </div>
          <button style={{ marginTop: '1em' }} className="btn btn-lg btn-primary" type="submit">Register</button>
          <p className="text-muted">Already registered? Sign-in <a href="/">here</a></p>
          <p className="text-muted">© Pluckr {new Date().getFullYear()}</p>
        </form>
      </div>
    )
  }
}

export default connect()(Register);