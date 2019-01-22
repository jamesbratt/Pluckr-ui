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

  addDataSeries = (property, data, chartType) => {
    this.chartInstance.addSeries({
      name: property,
      type: chartType,
      data: data
    })  
  }

  setChartConfig = () => {
    const foo = [];
    this.props.datasets.forEach(
      dataSet => {
        if(dataSet.chartId === this.props.chartId) {
          foo.push({
            name: dataSet.property,
            type: dataSet.chartType,
            data: dataSet.data
          });
        }
      });

    this.chartInstance = Highcharts.chart(this.props.chartId, {

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
      series: foo,
    });
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