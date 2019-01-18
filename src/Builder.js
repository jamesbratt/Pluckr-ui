import React, { Component } from 'react';
import Chart from './builder_components/Chart';
import { StravaSetModelData } from './data_sources/Strava';
import { GenerateGuid } from './utils/Helpers';
import { EASY_OAUTH_REDIRECT, CHART_TYPES } from './Constants';
import { addChart } from './actions';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state
};

class Builder extends Component {

  constructor(props) {
    super(props);
    this.state = {selectedChartType: ''};
  }

  addChart = (event) => {
    event.preventDefault();
    this.props.dispatch(
      addChart(
        GenerateGuid(),
        this.state.selectedChartType
      )
    );
  }

  selectChartType = (event) => {
    this.setState({selectedChartType: event.target.value});
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
        <form onSubmit={this.addChart}>
          <select onChange={this.selectChartType}>
            {CHART_TYPES.map(chartType => {
              return <option value={chartType.value}>{chartType.label}</option>
            })}
          </select>
          <button>Add Chart</button>
        </form>
        {this.props.charts.map(chart => {
          return <Chart id={chart.id} type={chart.type} />;
        })}
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(Builder);
