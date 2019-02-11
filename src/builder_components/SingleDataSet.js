import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state;
};

const SingleDataSet = (props) => {

  return (
    <div>{props.id}</div>
  );
}

export default connect(
  mapStateToProps
)(SingleDataSet);