import React, { Component } from 'react';
import SingleDataSet from './SingleDataSet';
import { connect } from 'react-redux';
import { GenerateGuid } from '../utils/Helpers';
import { addDataset, runDataset } from '../actions';
import { CHART_TYPES } from '../Constants';
import { executeOperations } from '../data_parsing/parse';

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
      dataSetXaxis: 'NONE',
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
  
      this.props.dispatch(
        addDataset(
          newDataSetId,
          sourceId,
          this.props.chartId,
          true,
          this.state.dataSetTitle,
          this.state.dataSetXaxis,
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

  onSelectXaxis = (event) => {
    this.setState({dataSetXaxis: event.target.value})
  }

  runDataSet = () => {
    const dataSet = this.props.datasets.find(dataset => dataset.isActive === true);
    const operations = this.props.operations.filter(operation => operation.dataSetId === dataSet.id);

    const dataSource = this.props.sources.find(
      source => source.id === this.state.selectedDataSource,
    );

    const data = executeOperations(
      dataSource.rawData,
      dataSet,
      operations,
    );

    this.props.addData(
      dataSet.title, // data series name
      data, // the actual data
      'line', // line or area
      false, // bool does have a y axis
    );

    this.props.dispatch(
      runDataset(
        dataSet.id,
        data,
      )
    );
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
            <div class="form-check form-check-inline">
              <input onChange={this.onSelectXaxis} class="form-check-input" type="radio" name="xaxis" id="linear-xaxis" value="LINEAR" />
              <label class="form-check-label" for="linear-xaxis">
                Linear x-axis
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input onChange={this.onSelectXaxis} class="form-check-input" type="radio" name="xaxis" id="datetime-xaxis" value="DATETIME" />
              <label class="form-check-label" for="datetime-xaxis">
                Datetime x-axis
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input onChange={this.onSelectXaxis} class="form-check-input" type="radio" name="xaxis" id="none-xaxis" value="NONE" />
              <label class="form-check-label" for="none-xaxis">
                None
              </label>
            </div>
            <button className="btn btn-primary my-2 my-sm-0" type="submit">New Dataset</button>
          </form>
        </div>
        <div className="col-md-4 wrapper">
            {activeDataset ? <SingleDataSet dataset={activeDataset} dataProperties={dataProperties} run={this.runDataSet} /> : null}
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
)(DataSetConfig);