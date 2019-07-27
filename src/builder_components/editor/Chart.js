import React, { Component } from 'react';
import DataSetList from '../datasets/DataSetList';
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
        <div>Chart</div>
        <Route
          exact
          path={this.props.match.path}
          render={() => <DataSetList chartId={this.props.match.params.id} url={this.props.match.url} />}
        />
        <Route path={`${this.props.match.path}/edit-dataset/:dataset_id`} component={DataSetDetail} />
      </div>
    )
  };
};

export default connect(
  mapStateToProps,
)(Chart);
