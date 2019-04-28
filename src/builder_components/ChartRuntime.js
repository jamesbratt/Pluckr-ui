import React, { Component } from 'react';
import { connect } from 'react-redux';
import Datasets from './Datasets';
import classNames from 'classnames';

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

  addYaxis = (dataSetId, title) => {
    const newYaxisId = `yaxis-${dataSetId}`;
    this.chartInstance.addAxis({
      title: {
          text: title,
      },
      opposite: this.chartInstance.series.length > 0 ? true : false,
      id: newYaxisId,
    });
  }

  addDataSeries = (datasetId, title, data, chartType, options) => {
    const newDataSeries = {
      id: datasetId,
      name: title,
      type: chartType,
      data: data,
    };

    const existingSeries = this.chartInstance.get(datasetId);

    if (existingSeries) {
      existingSeries.update({
        name: title,
        data: data,
      });
    } else {
      newDataSeries['yAxis'] = `yaxis-${datasetId}`;
      this.chartInstance.addSeries(newDataSeries)  
    }
  }

  updateDataSetYaxis = (datasetId, selectedYaxisDataSetId) => {
    const existingSeries = this.chartInstance.get(datasetId);
    if (existingSeries) {
      existingSeries.update({
        yAxis: `yaxis-${selectedYaxisDataSetId}`,
      });
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
          'line',
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
    const overlayClasses = classNames({
      'overlay': true,
      'overlay-hide': this.chartInstance && this.chartInstance.series.length > 0,
    });

    return (
      <div className="wrapper">
        <div className="row">
          <div style={{position: 'relative'}} className="col-md-12">
            <div className={overlayClasses}>
              <div className="overlay-text">
                <div className="overlay-text-inner">
                  <p>Start building your graph by adding a dataset</p>
                </div>
              </div>
            </div>
            <div style={{ ...style }} id={this.props.chartId} />
          </div>
        </div>
        <Datasets
          chartId={this.props.chartId}
          sources={this.props.sources}
          addData={this.addDataSeries}
          addYaxis={this.addYaxis}
          changeYaxis={this.updateDataSetYaxis}
        />
      </div>
    )
  }
}

export default connect(
  mapStateToProps
)(ChartRuntime);