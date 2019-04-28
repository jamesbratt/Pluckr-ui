import React, { Component } from 'react';
import Operations from './Operations';
import { connect } from 'react-redux';
import { GenerateGuid } from '../utils/Helpers';
import { addDataset, makeDatasetActive, runDataset, updateDatasetYaxis } from '../actions';
import { executeOperations } from '../data_parsing/parse';
import JSONTree from 'react-json-tree';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { clone } from 'ramda';

const mapStateToProps = state => {
  return state
};

class Datasets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProperties: [],
      selectedDataSource: null,
      dataSetTitle: null,
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

      const dataSource = this.props.sources.find(
        source => source.id === sourceId,
      );

      this.props.addYaxis(newDataSetId, this.state.dataSetTitle);
  
      this.props.dispatch(
        addDataset(
          newDataSetId,
          sourceId,
          this.props.chartId,
          true,
          this.state.dataSetTitle,
          dataSource.rawData,
        )
      );
    } else {
      alert('Fill out all required dataset fields');
    }

  }

  onSelectDataSetTitle = (event) => {
    this.setState({dataSetTitle: event.target.value})
  }

  onChangeYaxis = (event) => {
    const dataSet = this.props.datasets.find(dataset => dataset.isActive === true);
    this.props.changeYaxis(dataSet.id, event.target.value);
    this.props.dispatch(
      updateDatasetYaxis(
        dataSet.id,
        event.target.value
      )
    );
  }

  editDataset = (id) => {
    this.props.dispatch(
      makeDatasetActive(
        id,
        true,
      )
    )
  } 

  runDataSet = () => {
    let data = [];
    const dataSet = this.props.datasets.find(dataset => dataset.isActive === true);
    const operations = this.props.operations.filter(operation => operation.dataSetId === dataSet.id);

    const dataSource = this.props.sources.find(
      source => source.id === (this.state.selectedDataSource || dataSet.sourceId),
    );

    // Having to clone the source data here as for some reason
    // the highcharts api is mutating the raw data in the sources store
    const clonedData = clone(dataSource.rawData);

    try {
      data = executeOperations(
        clonedData,
        dataSet,
        operations,
      );
    } catch (error) {
      alert(error);
    } 

    this.props.addData(
      dataSet.id,
      dataSet.title,
      data, // the actual data
      this.props.chartConfig.seriesType,
    );

    this.props.dispatch(
      runDataset(
        dataSet.id,
        data
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
    const activeDataset = this.props.datasets.find(dataset => dataset.isActive === true);

    return (
      <React.Fragment>
        <div className="row wrapper">
          <div className="col-md-12">
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
            <div id="data-sets">
              <ul className="list-inline">
                {this.props.datasets.map(dataset => {
                  if(dataset.chartId === this.props.chartId) {
                    return <li className="list-inline-item">
                      {dataset.title}
                      <button onClick={() => this.editDataset(dataset.id)} type="button" className="edit-dataset">Edit</button>
                    </li>;
                  }
                })}
              </ul>
            </div>
          </div>
        </div>
        {activeDataset ?
        <React.Fragment>
          <div className="row">
            <div className="col-md-12">
              <h4>Dataset Configuration</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Tabs defaultActiveKey="operations" id="dataset-tabs">
                <Tab eventKey="operations" title="Operations">
                  <Operations run={this.runDataSet} dataSetId={activeDataset.id} dataSourceId={activeDataset.sourceId} />
                </Tab>
                <Tab eventKey="settings" title="Settings">
                  <div className="row">
                    <div className="col-md-4">
                      <label>Change Y-axis</label>
                      <select value={activeDataset.yaxis} onChange={this.onChangeYaxis} className="form-control" id="datasetSource">
                        <option value={null} hidden>-- Select a Y-axis --</option>
                        {this.props.datasets.map(dataset => {
                          return <option value={dataset.id}>{`yaxis-${dataset.title}`}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div style={{ maxHeight:"400px", overflow:"scroll", backgroundColor:"rgb(0, 43, 54)" }} className="col-md-6">
              {activeDataset ? <JSONTree data={activeDataset.rawData} /> : null}
            </div>
          </div>
        </React.Fragment>
        : null}
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
)(Datasets);