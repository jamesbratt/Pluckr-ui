import React, { Component } from 'react';
import DatasetConfiguration from './DatasetConfiguration';
import { connect } from 'react-redux';
import { GenerateGuid } from '../utils/Helpers';
import { addDataset, makeDatasetActive, runDataset } from '../actions';
import { executeOperations } from '../data_parsing/parse';

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
      fieldsToUpdate: {
        hasYaxis: true,
      },
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
        )
      );
    } else {
      alert('Fill out all required dataset fields');
    }

  }

  onSelectDataSetTitle = (event) => {
    this.setState({dataSetTitle: event.target.value})
  }

  updateDataset = (event) => {
    const key = event.target.name;
    const isBooleanType = event.target.type === 'checkbox';
    const value = isBooleanType ? event.target.checked : event.target.value;
    const dataToUpdate = this.state.fieldsToUpdate;

    dataToUpdate[key] = value;
    this.setState({ fieldsToUpdate: dataToUpdate });
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
      source => source.id === this.state.selectedDataSource || dataSet.sourceId,
    );

    try {
      data = executeOperations(
        dataSource.rawData,
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
      'line', // line or area
      this.state.fieldsToUpdate,
    );

    this.props.dispatch(
      runDataset(
        dataSet.id,
        data,
        this.state.fieldsToUpdate,
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
        <div className="row wrapper">
          <div className="col-md-12">
            <h4>Add datasets</h4>
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
        <DatasetConfiguration
          dataset={activeDataset}
          dataProperties={dataProperties}
          run={this.runDataSet}
          update={this.updateDataset}
        />
        : null}
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
)(Datasets);