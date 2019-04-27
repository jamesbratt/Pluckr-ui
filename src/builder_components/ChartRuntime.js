import React, { Component } from 'react';
import { connect } from 'react-redux';
import JSONTree from 'react-json-tree'
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

  addDataSeries = (datasetId, title, data, chartType, options) => {
    
    const newDataSeries = {
      id: datasetId,
      name: options.title || title,
      type: 'bar',
      data: data,
    };

    const existingSeries = this.chartInstance.get(datasetId);

    if (existingSeries) {
      const axis = this.chartInstance.get(`yaxis-${datasetId}`);
      axis.update({
        visible: options.hasYaxis,
        title: {
          text: options.title || title,
        },
      });
      existingSeries.update({
        name: options.title || title,
        data: data,
      });
    } else {
      const newYaxisId = `yaxis-${datasetId}`;
      this.chartInstance.addAxis({
          title: {
              text: options.title || title,
          },
          opposite: this.chartInstance.series.length > 0 ? true : false,
          id: newYaxisId,
          visible: options.hasYaxis
      })
      newDataSeries['yAxis'] = newYaxisId;
      this.chartInstance.addSeries(newDataSeries)  
    }
  }

  updateDataSeriesConfig = (property, isChecked) => {
    const existingSeries = this.chartInstance.get(property);
    if (existingSeries) {
      const axis = this.chartInstance.get(`yaxis-${property}`);
      axis.update({
        visible: isChecked
      });
    } else {
      alert('Error! You need to run this dataset first')
    }
  }

  updateChartConfig = (value) => {
    this.chartInstance.xAxis[0].update({ type: value });
  }

  setChartConfig = () => {
    const chartConfig = {
      title: {
        text: this.props.chartName
      },
      xAxis: {
        type: this.props.chartConfig.xaxis,
      },
      yAxis: {
        title: false
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
          dataset.id,
          dataset.title,
          dataset.rawData,
          'column',
          dataset, // Just expects everything
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
    const activeDataset = this.props.datasets.find(dataset => dataset.isActive === true);  
    return (
      <div className="wrapper">
        <ChartConfiguration chartId={this.props.chartId} updateChart={this.updateChartConfig} />
        <Datasets
          chartId={this.props.chartId}
          sources={this.props.sources}
          addData={this.addDataSeries}
        />
        <div className="row">
          <div style={{ maxHeight:"400px", overflow:"scroll", backgroundColor:"rgb(0, 43, 54)" }} className="col-md-3">
            {activeDataset ? <JSONTree data={activeDataset.rawData} /> : null}
          </div>
          <div className="col-md-9">
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