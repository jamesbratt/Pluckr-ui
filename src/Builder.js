import React, { Component } from 'react';
import Chart from './builder_components/Chart';
import { StravaSetModelData } from './data_sources/Strava';
import { GenerateGuid } from './utils/Helpers';
import { EASY_OAUTH_REDIRECT } from './Constants';
import { addChart } from './actions';
import { connect } from 'react-redux'

const mapStateToProps = state => {
  return state
};

class Builder extends Component {

  addChart = () => {
    this.props.dispatch(
      addChart(GenerateGuid())
    );
  }

  componentDidMount() {
    const stravaToken = localStorage.getItem('token');
    if(!stravaToken) {
      document.location.replace(EASY_OAUTH_REDIRECT);
    } else {
      StravaSetModelData();
    }
  }

  render() {
    return (
      <div id='chart-canvas'>
        <h1>Chart Configurations</h1>
        <button onClick={this.addChart}>Add Chart</button>
        {this.props.charts.map(chart => {
          return <Chart id={chart.id} />;
        })}
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(Builder);
