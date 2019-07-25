import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    loader: state.loader,
  };
};

const Loader = (props) => {
  return props.loader ? 
  <Spinner animation="border" role="status">
    <span className="sr-only">Loading...</span>
  </Spinner> :
  null;
}

export default connect(mapStateToProps)(Loader);