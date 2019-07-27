import React, { Component } from 'react';
import ChartTabs from './ChartTabs';
import DataSetDetail from '../datasets/DataSetDetail';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Route } from "react-router-dom";

const style = {
  width: '100%',
  height: '400px',
  margin: '0 auto',
};

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    datasets: state.datasets,
  };
};

class Chart extends Component {
  render() {

    const overlayClasses = classNames({
      'overlay': true,
      'overlay-hide': this.chartInstance && this.props.datasets.length > 0,
    });

    return (
      <div>
        <h2>Chart Editor</h2>
        <div style={{position: 'relative', marginBottom: '1em'}}>
          <div className={overlayClasses}>
            <div className="overlay-text">
              <div className="overlay-text-inner">
                <p>Start building your chart by adding a dataset</p>
              </div>
            </div>
          </div>
          <div style={{ ...style }} id={this.props.chartName} />
        </div>
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
