import React, { Component } from 'react';
import SingleDataSet from './SingleDataSet';
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
      activeDataSet: null,
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

    if(this.state.selectedDataSource) {
      const newDataSetId = GenerateGuid();
      const sourceId = this.state.selectedDataSource;
  
      /*const dataSource = this.props.sources.find(
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
      );*/
  
      this.props.dispatch(
        addDataset(
          newDataSetId,
          sourceId,
          this.props.chartId,
          true,
        )
      );
    } else {
      alert('Fill out all required dataset fields');
    }

  }

  onSelectDataProperty = (event) => {
    this.setState({selectedDataProperty: event.target.value})
  }

  /*onSelectChartType = (event) => {
    this.setState({selectedChartType: event.target.value})
  }

  onHasAxis = (event) => {
    this.setState({hasAxis: event.target.checked})
  }*/

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
    const activeDataset = this.props.datasets.find(dataset => dataset.isActive === true);
    return (
      <div>
        <form onSubmit={this.addDataset} className="form-inline my-2 my-lg-0">
            <select className="form-control mr-sm-2" id="datasetSource" value={this.state.selectedDataSource} onChange={this.getSourceData}>
              <option value={null} hidden>-- Select a data source --</option>
              {this.props.sources.map(source => {
                if(source.chartId === this.props.chartId) {
                  return <option value={source.id}>{source.name}</option>;
                }
              })}
            </select>
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">New Dataset</button>
        </form>
        <ul>
          {this.props.datasets.map(dataset => {
            if(dataset.chartId === this.props.chartId) {
              return <li>{dataset.title}</li>;
            }
          })}
        </ul>
        <div>
          {activeDataset ? <SingleDataSet id={activeDataset.id} /> : null}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(DataSetConfig);