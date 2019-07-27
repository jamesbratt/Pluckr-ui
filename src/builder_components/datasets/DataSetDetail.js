import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
  };
};

class DataSetDetail extends Component {
  render() {
    return (
      <div>
        Detail
      </div>
    )
  };
};

export default connect(
  mapStateToProps,
)(DataSetDetail);
