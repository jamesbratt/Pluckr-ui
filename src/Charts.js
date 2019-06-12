import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCharts } from './actions';

const mapStateToProps = state => {
  return state
};

class Charts extends Component {

    componentDidMount() {
      const user = this.props.user[0].username;
      const apiKey = this.props.user[0].api_key;
      this.props.dispatch(
        fetchCharts(
          apiKey,
          user,
        )
      );
    }

    render() {
      return (
          <div class="container"></div>
      )
    }
}

export default connect(
  mapStateToProps
)(Charts);