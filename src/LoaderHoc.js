import * as React from "react";
import { connect } from 'react-redux';
import Loader from './Loader';

const WithLoading = WrappedComponent => {
  
  const mapStateToProps = state => {
    return state
  };

  class LoadingScreen extends React.Component {
    render() {
      if (this.props.loader) {
        return (<Loader />);
      }
      return <WrappedComponent {...this.props} />;
    }
  };

  return connect(mapStateToProps)(LoadingScreen);
};

export default WithLoading;