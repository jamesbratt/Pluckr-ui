import React, { Component } from 'react';
import Operations from './Operations';
import { connect } from 'react-redux';
import { createDataSet, fetchDatasets, runDataSet } from '../actions';
import JSONTree from 'react-json-tree';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

const mapStateToProps = state => {
  return state
};

class Datasets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProperties: [],
      selectedDataSource: '',
      dataSetTitle: null,
      activeDataset: null,
    };
  }

  getSourceData = (event) => {
      const selectedSource = this.props.sources.find(
        source => source.id === parseInt(event.target.value),
      );
      this.setState({
        dataProperties: selectedSource.properties,
        selectedDataSource: event.target.value
      });
  }

  addDataset = (event) => {
    event.preventDefault();

    if(this.state.selectedDataSource && this.state.dataSetTitle) {
      const sourceId = this.state.selectedDataSource;
      const dataSource = this.props.sources.find(
        source => source.id === parseInt(sourceId),
      );
      const user = this.props.user[0].username;
      const apiKey = this.props.user[0].api_key;
  
      this.props.dispatch(
        createDataSet(
          apiKey,
          user,
          this.state.dataSetTitle,
          this.props.chartId,
          sourceId,
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

  /*onChangeYaxis = (event) => {
    const dataSet = this.props.datasets.find(dataset => dataset.isActive === true);
    this.props.changeYaxis(dataSet.id, event.target.value);
    this.props.dispatch(
      updateDatasetYaxis(
        dataSet.id,
        event.target.value
      )
    );
  }*/

  editDataset = (id) => {
    this.setState({ activeDataset: id });
  }
  
  runDataSet = (id) => {
    const user = this.props.user[0].username;
    const apiKey = this.props.user[0].api_key;
    this.props.dispatch(
      runDataSet(
        apiKey,
        user,
        id,
        this.props.addData,
        this.props.chartConfig.series_type,
      )
    );
  }

  componentDidMount() {
    const user = this.props.user[0].username;
    const apiKey = this.props.user[0].api_key;
    this.props.dispatch(
      fetchDatasets(
        apiKey,
        user,
        this.props.chartId,
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
    const activeDataset = this.props.datasets.find(dataset => dataset.id === this.state.activeDataset);

    return (
      <React.Fragment>
        <div className="row wrapper">
          <div className="col-md-12">
            <form onSubmit={this.addDataset} className="form-inline my-2 my-lg-0">
              <select className="form-control mr-sm-2" id="datasetSource" value={this.state.selectedDataSource} onChange={this.getSourceData}>
                <option value={null} hidden>-- Select a data source --</option>
                {this.props.sources.map(source => {
                  if(source.chart === this.props.chartId) {
                    return <option key={source.name} value={source.id}>{source.name}</option>;
                  }
                })}
              </select>
              <input onKeyUp={this.onSelectDataSetTitle} className="form-control mr-sm-2" type="text" placeholder="Dataset title" />
              <button className="btn btn-primary my-2 my-sm-0" type="submit">New Dataset</button>
            </form>
            <div id="data-sets">
              <ul className="list-inline">
                {this.props.datasets.map(dataset => {
                  if(dataset.chart === this.props.chartId) {
                    return <li key={dataset.name} className="list-inline-item">
                      {dataset.name}
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
                  <Operations
                    run={this.runDataSet}
                    dataSetId={activeDataset.id}
                    dataSourceId={activeDataset.data_source} />
                </Tab>
                <Tab eventKey="settings" title="Settings">
                  <div className="row">
                    <div className="col-md-4">
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div style={{ maxHeight:"400px", overflow:"scroll", backgroundColor:"rgb(0, 43, 54)" }} className="col-md-6">
              {activeDataset ? <JSONTree data={activeDataset.data} /> : null}
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