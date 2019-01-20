import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GenerateGuid } from '../utils/Helpers';
import { addDataset } from '../actions';
import { CHART_TYPES } from '../Constants';
import { parseDataSeries } from '../data_parsing/parse';

const mapStateToProps = state => {
  return state
};

class DataSetConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProperties: [],
      selectedDataSource: null,
      selectedDataProperty: null,
      selectedChartType: null,
    };
  }

  getSourceData = (event) => {
      const selectedSource = this.props.sources.find(
        source => source.id === event.target.value
      );
      this.setState({
        dataProperties: selectedSource.properties,
        selectedDataSource: event.target.value
      });
  }

  addDataset = (event) => {
    event.preventDefault();

    if(this.state.selectedDataSource && this.state.selectedDataProperty && this.state.selectedChartType) {
      const newDataSetId = GenerateGuid();
      const dataProperty = this.state.selectedDataProperty;
      const chartType = this.state.selectedChartType;
      const sourceId = this.state.selectedDataSource;
  
      const dataSource = this.props.sources.find(
        source => source.id === sourceId
      );
  
      const data = parseDataSeries(
        dataSource.rawData,
        dataProperty,
      );
  
      this.props.addData(
        dataProperty,
        data,
        chartType,
      );
  
      this.props.dispatch(
        addDataset(
          newDataSetId,
          sourceId,
          this.props.chartId,
          dataProperty,
          data,
        )
      );
    } else {
      alert('Fill out all required dataset fields');
    }

  }

  onSelectDataProperty = (event) => {
    this.setState({selectedDataProperty: event.target.value})
  }

  onSelectChartType = (event) => {
    this.setState({selectedChartType: event.target.value})
  } 

  render() {
    const dataProperties = this.state.dataProperties;
    return (
      <div>
        <h2>Data Sets</h2>
        <ul>
          {this.props.datasets.map(dataset => {
            if(dataset.chartId === this.props.chartId) {
              return <li>{dataset.property}</li>;
            }
          })}
        </ul>
        <form onSubmit={this.addDataset}>
          <div>
            <select onChange={this.getSourceData}>
            <option value="" selected disabled hidden>-- Select a data source --</option>;
              {this.props.sources.map(source => {
                if(source.chartId === this.props.chartId) {
                  return <option value={source.id}>{source.name}</option>;
                }
              })}
            </select>
          </div>
          <div>
            <select onChange={this.onSelectDataProperty}>
              <option value="" selected disabled hidden>-- Select a data property --</option>;
              {dataProperties.map(property => {
                return <option value={property}>{property}</option>;
              })}
            </select>
          </div>
          <div>
            <select onChange={this.onSelectChartType}>
              <option value="" selected disabled hidden>-- Select a chart type --</option>;
              {CHART_TYPES.map(chartType => {
                return <option value={chartType.value}>{chartType.label}</option>
              })}
            </select>
          </div>
          <div>
            <button>Add a Data Set</button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(DataSetConfig);