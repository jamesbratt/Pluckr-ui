import React, { Component } from 'react';
import { connect } from 'react-redux';

var Highcharts = require('highcharts');

const style = {
  minWidth: '310px',
  maxWidth: '800px',
  height: '400px',
  margin: '0 auto',
};

const mapStateToProps = state => {
  return state
};

class RuntimeChart extends Component {

  constructor(props) {
    super(props);
    this.chartInstance = null;
    this.state = {
      dataSets: this.props.datasets.filter(
        dataset => dataset.chartId === this.props.id
      )
    }
  }

  componentDidMount() {

    this.chartInstance = Highcharts.chart(this.props.id, {

      title: {
        text: 'Solar Employment Growth by Sector, 2010-2016'
      },
      xAxis: {
        type: 'datetime'
      },    
      yAxis: {
        title: {
          text: 'Number of Employees'
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
    
      series: [],
    
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    
    });
  }

  render() {
    const dataSets = this.props.datasets.filter(
        dataset => dataset.chartId === this.props.id
    );

    if(dataSets.length > 0) {
      dataSets.forEach(dataSet => {
        this.chartInstance.addSeries({
          name: dataSet.property,
          type: 'line',
          data: dataSet.data
        })
      });
    }
  
    return (
      <div style={{ ...style }} id={this.props.id} />
    )
  }
}

export default connect(
  mapStateToProps
)(RuntimeChart);