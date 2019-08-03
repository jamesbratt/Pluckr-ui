import React, { Component } from 'react';
import ChartTabs from './ChartTabs';
import DataSetDetail from '../datasets/DataSetDetail';
import classNames from 'classnames';
import { addDataSeries, destroyChart, getChart, setChart } from './Graph';
import { connect } from 'react-redux';
import { Route } from "react-router-dom";

const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

const style = {
  width: '100%',
  height: '400px',
  margin: '0 auto',
};

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    datasets: state.datasets,
    charts: state.charts,
  };
};

class Chart extends Component {

  constructor(props) {
    super(props);
    this.chartInstance = getChart();
  }

  setUpChartData = (chart) => {
    this.props.datasets.forEach((dataset) => {
      if(dataset.chart === chart.id) {
        addDataSeries(
          dataset.id,
          dataset.name,
          dataset.data,
          chart.series_type,
          dataset,
        );
      }
    })
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const chart = this.props.charts.find(chart => chart.id === parseInt(id));

    const chartConfig = {
      title: {
        text: chart.name
      },
      chart: {
        backgroundColor: chart.background_color ? chart.background_color : null
      },
      xAxis: {
        type: chart.chart_type,
        id: 'master-x-axis',
        visible: chart.x_axis_enabled,
        title: {
          text: chart.x_axis_title,
        }
      },
      yAxis: {
        title: false,
        gridLineWidth: 0,
        minorGridLineWidth: 0,
      },    
      legend: {
        align: 'left',
        verticalAlign: 'top',
      }
    };
  
    const chartInstance = Highcharts.chart(
      `chart-${chart.id}`,
      chartConfig
    );

    setChart(chartInstance);
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props.match.params;
    const chart = this.props.charts.find(chart => chart.id === parseInt(id));
    this.setUpChartData(chart);
  }

  componentWillUnmount() {
    destroyChart();
  }

  render() {

    const { id } = this.props.match.params;

    const overlayClasses = classNames({
      'overlay': true,
      'overlay-hide': this.props.datasets.length > 0,
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
          <div style={{ ...style }} id={`chart-${id}`} />
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
