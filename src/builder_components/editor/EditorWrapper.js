import * as React from "react";
import Loader from '../../Loader';
import Chart from './Chart';

import { connect } from 'react-redux';
import { fetchCharts } from '../../actions/chart';

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    charts: state.charts,
    sources: state.sources.data,
    datasets: state.datasets,
    loader: state.loader,
  };
};

const mapDispatchToProps = {
  fetchCharts,
};

class EditorWrapper extends React.Component {

  componentDidMount() {
    const user = this.props.user.username;
    const apiKey = this.props.user.api_key;

    if (this.props.charts.length === 0) {
      this.props.fetchCharts(
          apiKey,
          user,
        )
    }
  }
  
  render() {
    return (
      <>
        {this.props.loader ? <Loader /> : 
          <Chart {...this.props} />}
      </>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorWrapper);