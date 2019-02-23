import React, { Component } from 'react';
import { connect } from 'react-redux';
import Datasets from './Datasets';
import ChartConfiguration from './ChartConfiguration';

var Highcharts = require('highcharts');

const style = {
  width: '100%',
  height: '400px',
  margin: '0 auto',
};

const mapStateToProps = state => {
  return state
};

class ChartRuntime extends Component {

  constructor(props) {
    super(props);
    this.chartInstance = null;
  }

  addDataSeries = (property, data, chartType, hasAxis) => {
    const newDataSeries = {
      id: property,
      name: property,
      type: chartType,
      data: data
    };

    if(hasAxis) {
      const newYaxisId = this.chartInstance.yAxis.length + 1;
      this.chartInstance.addAxis({
          title: {
              text: property
          },
          opposite: true,
          id: newYaxisId,
      })
      newDataSeries['yAxis'] = newYaxisId;
    }

    const existingSeries = this.chartInstance.get(property);
    if (existingSeries) {
      existingSeries.setData(data);
    } else {
      this.chartInstance.addSeries(newDataSeries)  
    }
  }

  setChartConfig = () => {
    const chartConfig = {
      title: {
        text: this.props.chartName
      },
      xAxis: {
        type: 'linear',
      },    
      legend: {
        align: 'left',
        verticalAlign: 'top',
      }
    };

    this.chartInstance = Highcharts.chart(
      this.props.chartId,
      chartConfig
    );

    this.props.datasets.forEach((dataset) => {
      if(dataset.chartId === this.props.chartId) {
        this.addDataSeries(
          dataset.title,
          dataset.rawData,
          'line',
          false,
        );
      }
    })
  }

  componentDidUpdate(prevProps) {
    if(prevProps.chartId !== this.props.chartId) {
      this.chartInstance.destroy();
      this.setChartConfig();
    }
  }

  componentWillUnmount() {
    this.chartInstance.destroy();
  }

  componentDidMount() {
    this.setChartConfig();
  }

  render() {  
    return (
      <div className="wrapper">
        <ChartConfiguration />
        <Datasets chartId={this.props.chartId} sources={this.props.sources} addData={this.addDataSeries} />
        <div className="row">
          <div className="col-md-12">
            <div style={{ ...style }} id={this.props.chartId} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps
)(ChartRuntime);