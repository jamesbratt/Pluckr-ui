import React, { Component } from 'react';
import Wrapper from './Wrapper';
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

export default connect(mapStateToProps)(Login);