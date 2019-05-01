import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux';
import { addSource } from '../actions';
import { GenerateGuid } from '../utils/Helpers';
import ChartRuntime from './ChartRuntime';
import { DATA_TYPES } from '../Constants';

const mapStateToProps = state => {
  return state
};

class Chart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: true,
      selectedProvider: null,
      selectedResource: null,
      sourceName: null,
      parameterFields: [],
      parameterValues: [],
    };
  }

  handleClose = () => {
    this.setState({
      show: false,
      sourceName: null,
      selectedProvider: null,
      parameterFields: [],
      parameterValues: [],
    });
  }

  handleShow = () => {
    this.setState({
      show: true
    });
  }

  addDataSource = (event) => {
    const selectedResource = this.state.selectedResource;
    const params = this.state.parameterValues;
    const sourceName = this.state.sourceName;
    event.preventDefault();
    if(selectedResource && sourceName) {
      this.state.selectedProvider.request(selectedResource, params)
        .then(response => {
          this.setState({
            show: false,
            selectedProvider: null,
            selectedResource: null,
            sourceName: null,
            parameterFields: [],
            parameterValues: [],

          }, () => {
            this.props.dispatch(
              addSource(
                GenerateGuid(),
                sourceName,
                this.props.id,
                selectedResource,
                response.data,
                response.properties,
              )
            );
          });
        })
    } else {
      alert('Fill out all required data source fields');
    }
  }

  onProviderChange = (event) => {
    if (event.target.value) {
      const selectedProvider = this.props.dataProviders.find(
        dataProvider => dataProvider.provider === event.target.value
      );

      this.setState({
        selectedProvider,
        selectedResource: null,
        parameterFields: [],
        parameterValues: [],
      });
    } else {
      this.setState({
        selectedProvider: null,
        selectedResource: null,
        parameterFields: [],
        parameterValues: [],
      });
    }
  }

  onResourceChange = (event) => {
    if (this.state.selectedProvider && event.target.value) {
      let availableFields = [];
      const resourceName = event.target.value;
      const resourceParams = this.state.selectedProvider.resources[resourceName].parameters;
  
      if (resourceParams) {
        availableFields = resourceParams;
      }
  
      this.setState({
        selectedResource: resourceName,
        parameterFields: availableFields,
      });
    } else {
      this.setState({
        parameterFields: [],
        parameterValues: [],
      });
    }
  }

  onParameterChange = (event) => {
    const parameterName = event.target.name;
    const parameterValue = event.target.value;
    const constructedParams = this.state.parameterValues;
    const newParams = [];

    if (constructedParams.length > 0) {
      constructedParams.forEach(parameter => {
        if (parameter.name && parameter.name === parameterName) {
          parameter.value = parameterValue;
        } else {
          newParams.push({ name: parameter.name, value: parameter.value });
        }
      });
      newParams.push({ name: parameterName, value: parameterValue });
    } else {
      newParams.push({ name: parameterName, value: parameterValue });
    }
    this.setState({ parameterValues: newParams });
  }

  onSourceNameChange = (event) => {
    this.setState({ sourceName: event.target.value });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.id !== this.props.id) {
      this.setState({
        sourceName: null,
        selectedProvider: null,
        parameterFields: [],
        parameterValues: [],
      });
    }
  }

  render() {
    let parameters = [];

    const availableSources = this.props.sources.filter((source) => {
      return source.chartId === this.props.id;
    });

    if (this.state.parameterFields.length > 0) {
      parameters = this.state.parameterFields.map(parameterField => {
        switch(parameterField.type) {
          case DATA_TYPES.date:
            return (
              <React.Fragment>
                <div class="form-group">
                  <label>{parameterField.name}</label>
                  <input name={parameterField.name} onChange={this.onParameterChange} type="date" className="form-control" placeholder={parameterField.name} />
                </div>
              </React.Fragment>
            );
          case DATA_TYPES.int:
            return (
              <React.Fragment>
                <div class="form-group">
                  <label>{parameterField.name}</label>
                  <input name={parameterField.name} onKeyUp={this.onParameterChange} type="number" className="form-control" placeholder={parameterField.name} />
                </div>
              </React.Fragment>
            );
          default:
            return (
              <React.Fragment>
                <div class="form-group">
                  <label>{parameterField.name}</label>
                  <input name={parameterField.name} onKeyUp={this.onParameterChange} type="text" className="form-control" placeholder={parameterField.name} />
                </div>
              </React.Fragment>
            );          
        }
      })
    }

    return (
      <div id="chart-config">
        <div id="data-sources" className="row">
          <div className="col-md-12">
            <h3 className="float-left">{this.props.name}</h3>
            <button onClick={this.handleShow} type="button" className="btn btn-primary float-right">
            New Data Source <span class="badge badge-light">{availableSources.length}</span>
            </button>
          </div>
        </div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a data source</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div class="form-group">
                <label>Title</label>
                <input value={this.state.sourceName || ''} onChange={this.onSourceNameChange} type="text" className="form-control" placeholder="Enter a title" />
              </div>
              <div class="form-group">
                <label>Data Provider</label>
                <select onChange={this.onProviderChange} className="form-control" id="dataProvider">
                  <option value="">-- Select a data provider --</option>;
                  {this.props.dataProviders.map((dataProvider) => {
                    if (dataProvider.isActive) {
                      return <option value={dataProvider.provider}>{dataProvider.provider}</option>
                    }
                  })}
                </select>            
              </div>
              {this.state.selectedProvider ?
                <div class="form-group">
                  <label>Resource</label>
                  <select onChange={this.onResourceChange} className="form-control" id="dataSourceResource">
                    <option value="">-- Select a resource --</option>;
                    {Object.keys(this.state.selectedProvider.resources).map(resourceKey => {
                      return <option value={this.state.selectedProvider.resources[resourceKey].name}>{this.state.selectedProvider.resources[resourceKey].label}</option>
                    })}
                  </select>            
                </div>
              : null
              }

              {parameters}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={this.addDataSource} type="submit" className="btn btn-primary mb-2">Add Data Source</button>
          </Modal.Footer>
        </Modal>
        {availableSources.length > 0 ? <ChartRuntime chartId={this.props.id} chartName={this.props.name} sources={availableSources} chartConfig={this.props.chartConfig} /> : null}
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(Chart);