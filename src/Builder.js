import React, { Component } from 'react';
import Chart from './builder_components/Chart';
import { StravaSetModelData } from './data_sources/Strava';
import { GenerateGuid } from './utils/Helpers';
import { EASY_OAUTH_REDIRECT } from './Constants';

class Builder extends Component {

  // TODO - obvs use redux
  constructor(props) {
    super(props);
    this.state = {
      charts: []
    };
  }

  addChart = () => {
    const charts = this.state.charts;
    charts.push(GenerateGuid());
    this.setState(charts);
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
        {this.state.charts.map(chart => {
          return <Chart id={chart} />;
        })}
      </div>
    );
  }
}

export default Builder;