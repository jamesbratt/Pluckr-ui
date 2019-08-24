import React from 'react';

class Register extends React.Component {
  render() {
    return (
      <div className="login-wrapper">
        <form className="form-register">
          <h1 style={{textAlign: "center"}} className="h3 mb-3 font-weight-normal">Register as a Beta Tester</h1>
          <p>To make Pluckr the best it can be, we need feedback from users. Your beta test account will be active for 30 days, after which your feedback will be requested.</p>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" placeholder="Please enter your email address" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" placeholder="Please enter a password" />
          </div>
          <div className="form-group">
            <label>Password Confirmation</label>
            <input className="form-control" type="password" placeholder="Confirm your password" />
          </div>
          <button className="btn btn-lg btn-primary" type="submit">Register</button>
          <p className="mt-5 mb-3 text-muted">Already registered? Sign-in <a href="/">here</a></p>
          <p className="mt-5 mb-3 text-muted">© Pluckr {new Date().getFullYear()}</p>
        </form>
      </div>
    )
  }
}

export default Register;