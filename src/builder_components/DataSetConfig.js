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
      hasAxis: false,
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
      const hasAxis = this.state.hasAxis;
  
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
        hasAxis,
      );
  
      this.props.dispatch(
        addDataset(
          newDataSetId,
          sourceId,
          this.props.chartId,
          dataProperty,
          data,
          chartType,
          hasAxis,
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

  onHasAxis = (event) => {
    this.setState({hasAxis: event.target.checked})
  }

  componentDidUpdate(prevProps) {
    if(prevProps.chartId !== this.props.chartId) {
      this.setState({
        selectedDataSource: null,
        selectedChartType: null,
        selectedDataProperty: null,
        hasAxis: false,
      });
    }
  }

  render() {
    const dataProperties = this.state.dataProperties;
    return (
      <div>
        <ul>
          {this.props.datasets.map(dataset => {
            if(dataset.chartId === this.props.chartId) {
              return <li>{dataset.property}</li>;
            }
          })}
        </ul>
        <form onSubmit={this.addDataset}>
          <div class="form-group">
            <label for="datasetSource">Data Source</label>
            <select className="form-control" id="datasetSource" value={this.state.selectedDataSource} onChange={this.getSourceData}>
              <option value={null} hidden>-- Select a data source --</option>
              {this.props.sources.map(source => {
                if(source.chartId === this.props.chartId) {
                  return <option value={source.id}>{source.name}</option>;
                }
              })}
            </select>
          </div>

          <div class="form-group">
            <label for="datasetProperty">Data Property</label>
            <select className="form-control" id="datasetProperty" value={this.state.selectedDataProperty} onChange={this.onSelectDataProperty}>
              <option value={null} hidden>-- Select a data property --</option>
              {dataProperties.map(property => {
                return <option value={property}>{property}</option>;
              })}
            </select>
          </div>

          <div class="form-group">
            <label for="datasetType">Data Type</label>
            <select className="form-control" id="datasetType" value={this.state.selectedChartType} onChange={this.onSelectChartType}>
              <option value={null} hidden>-- Select a type --</option>;
              {CHART_TYPES.map(chartType => {
                return <option value={chartType.value}>{chartType.label}</option>
              })}
            </select>
          </div>
        
          <div class="form-group form-check">
            <input class="form-check-input" checked={this.state.hasAxis} type="checkbox" onClick={this.onHasAxis} />
            <label class="form-check-label">Add an axis?</label>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(DataSetConfig);