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
      dataSetTitle: null,
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

    if(this.state.selectedDataSource && this.state.dataSetTitle) {
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
          this.state.dataSetTitle,
        )
      );
    } else {
      alert('Fill out all required dataset fields');
    }

  }

  onSelectDataProperty = (event) => {
    this.setState({selectedDataProperty: event.target.value})
  }

  onSelectDataSetTitle = (event) => {
    this.setState({dataSetTitle: event.target.value})
  }

  /*onHasAxis = (event) => {
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
      <React.Fragment>
        <div className="col-md-12">
          <h4>Add datasets</h4>
          <div id="data-sets">
            <ul className="list-inline">
              {this.props.datasets.map(dataset => {
                if(dataset.chartId === this.props.chartId) {
                  return <li className="list-inline-item">{dataset.title}</li>;
                }
              })}
            </ul>
          </div>
          <form onSubmit={this.addDataset} className="form-inline my-2 my-lg-0">
            <select className="form-control mr-sm-2" id="datasetSource" value={this.state.selectedDataSource} onChange={this.getSourceData}>
              <option value={null} hidden>-- Select a data source --</option>
              {this.props.sources.map(source => {
                if(source.chartId === this.props.chartId) {
                  return <option value={source.id}>{source.name}</option>;
                }
              })}
            </select>
            <input onKeyUp={this.onSelectDataSetTitle} className="form-control mr-sm-2" type="text" placeholder="Dataset title" />
            <button className="btn btn-primary my-2 my-sm-0" type="submit">New Dataset</button>
          </form>
        </div>
        <div className="col-md-4 wrapper">
            {activeDataset ? <SingleDataSet dataset={activeDataset} dataProperties={dataProperties} /> : null}
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
)(DataSetConfig);