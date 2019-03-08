import React, { Component } from 'react';
import Chart from './builder_components/Chart';
import AddChart from './builder_components/AddChart';
import ChartList from './builder_components/ChartList';
import { getProfile } from './data_sources/Strava';
import { EASY_OAUTH_REDIRECT } from './Constants';
import { connect } from 'react-redux';
import { makeChartActive } from './actions';
import './css/builder.css';

const mapStateToProps = state => {
  return state
};

class Builder extends Component {

  selectChartToEdit = (chart) => {
    this.props.dispatch(
      makeChartActive(
        chart.id,
        true,
      )
    );
  }

  componentDidMount() {
    const stravaToken = localStorage.getItem('token');
    if(!stravaToken) {
      document.location.replace(EASY_OAUTH_REDIRECT);
    } else {
      // This is just so we can check the token is still valid
      getProfile()
        .then(response => {
          if(response.errors) {
            document.location.replace(EASY_OAUTH_REDIRECT);
          }
        })
    }
  }

  render() {
    const chartToEdit = this.props.charts.find(chart => chart.isActive === true);
    return (
      <div id='chart-canvas'>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">Chart Builder</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              {this.props.charts.length > 0 ? <ChartList charts={this.props.charts} onSelect={this.selectChartToEdit} /> : null}
            </ul>
            <AddChart />
          </div>
        </nav>
        <div className='container-fluid wrapper'>
          {chartToEdit ? <h3>{chartToEdit.name}</h3> : null}
          {chartToEdit ? <Chart id={chartToEdit.id} name={chartToEdit.name} chartConfig={chartToEdit} /> : null}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(Builder);
