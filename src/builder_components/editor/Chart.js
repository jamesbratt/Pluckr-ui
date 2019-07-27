import React, { Component } from 'react';
import ChartTabs from './ChartTabs';
import DataSetDetail from '../datasets/DataSetDetail';
import { connect } from 'react-redux';
import { Route } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
  };
};

class Chart extends Component {
  render() {
    return (
      <div>
        <h2>Chart Editor</h2>
        <Route
          exact
          path={this.props.match.path}
          render={() => <ChartTabs chartId={this.props.match.params.id} url={this.props.match.url} />}
        />
        <Route path={`${this.props.match.path}/edit-dataset/:dataset_id`} component={DataSetDetail} />
      </div>
    )
  };
};

export default connect(
  mapStateToProps,
)(Chart);
