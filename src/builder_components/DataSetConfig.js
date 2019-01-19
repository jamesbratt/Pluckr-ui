import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GenerateGuid } from '../utils/Helpers';
import { addDataset } from '../actions';

const mapStateToProps = state => {
  return state
};

class DataSetConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProperties: [],
      selectedDataSource: '',
      selectedDataProperty: '',
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
    const data = [];
    this.props.dispatch(
      addDataset(
        GenerateGuid(),
        this.state.selectedDataSource,
        this.props.chartId,
        this.state.selectedDataProperty,
        data,
      )
    );
  }

  onSelectDataProperty = (event) => {
    this.setState({selectedDataProperty: event.target.value})
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
            <option>-- Select a data source --</option>;
              {this.props.sources.map(source => {
                if(source.chartId === this.props.chartId) {
                  return <option value={source.id}>{source.name}</option>;
                }
              })}
            </select>
          </div>
          <div>
            <select onChange={this.onSelectDataProperty}>
              <option>-- Select a data property --</option>;
              {dataProperties.map(property => {
                return <option value={property}>{property}</option>;
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