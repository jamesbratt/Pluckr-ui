import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataSetConfig from './DataSetConfig';

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
  
    this.chartInstance.addSeries(newDataSeries)  
  }

  setChartConfig = () => {
    const chartConfig = {
      title: {
        text: this.props.chartName
      },
      xAxis: {
        type: 'datetime',
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
          dataset.property,
          dataset.data,
          dataset.chartType,
          dataset.hasAxis,
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
      <div className="row">
        <div className="col-md-4">
          <h4>Data Sets</h4>
          <DataSetConfig chartId={this.props.chartId} sources={this.props.sources} addData={this.addDataSeries} />
        </div>
        <div className="col-md-8">
          <h4>Chart Runtime</h4>
          <div style={{ ...style }} id={this.props.chartId} />
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps
)(ChartRuntime);