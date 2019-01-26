import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataSetConfig from './DataSetConfig';

var Highcharts = require('highcharts');

const style = {
  width: '1000px',
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
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
    };

    this.chartInstance = Highcharts.chart(
      this.props.chartId,
      chartConfig
    );

    this.props.datasets.forEach((dataset) => {
      this.addDataSeries(
        dataset.property,
        dataset.data,
        dataset.chartType,
        dataset.hasAxis,
      );
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
      <div>
        <DataSetConfig chartId={this.props.chartId} sources={this.props.sources} addData={this.addDataSeries} />
        <div style={{ ...style }} id={this.props.chartId} />
      </div>
    )
  }
}

export default connect(
  mapStateToProps
)(ChartRuntime);