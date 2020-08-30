import React, { Component } from 'react';
import Picker from '../Picker';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import JSONTree from 'react-json-tree';
import DateSelector from './DateSelector';
import Loader from '../../Loader';
import axios from "axios";
import GenerateRequest from '../../utils/GenerateRequest';

import { Link } from "react-router-dom";
import { pathOr } from 'ramda';
import { DATA_TYPES } from '../../Constants';
import { connect } from 'react-redux';
import { createDataSource, fetchDataSources, setLoader } from '../../actions';
import { addNotification } from '../../actions/notification';
import { fetchProvider } from '../../actions/provider';
import { extractGlobalParameters } from '../../utils/Helpers';
import { Typeahead } from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/Typeahead.css';

const fetchDataSource = async (apiKey, username, datasourceId, dataProviders) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${username}:${apiKey}`
      },
      url: `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/datasource/${datasourceId}`,
    };

    try {
      const response = await axios(options)
      const dataSource = response.data;
      const provider = dataProviders.find(dataProvider => dataProvider.id === response.data.data_provider_id);
      const parametersModel = extractGlobalParameters(provider, dataSource.resource);

      try {

        const rawData = await GenerateRequest(
          provider,
          dataSource.resource,
          JSON.parse(dataSource.params),
          parametersModel,
          dataSource.id ? parseInt(dataSource.id) : null,
          username, apiKey,
        )

        dataSource.rawData = rawData;

        return dataSource;

      } catch(error) {
        throw Error(`Error from data provider: ${error.message}`);
      }

    } catch(error) {
      throw Error(error.error.message);
    }
}

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    dataProviders: state.dataProviders,
    providers: state.providers.providers,
    sources: state.sources.data,
    loader: state.loader,
  };
};

const mapDispatchToProps = {
  setLoader,
  createDataSource,
  fetchDataSources,
  addNotification,
  fetchDataSource,
  fetchProvider,
}

class DataSourceDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      selectedProvider: '',
      selectedResource: '',
      sourceName: null,
      parameterFields: [],
      parameterValues: [],
      data: null,
      newlySavedDataSoucerId: null,
    };
  }

  getDataSource = async (api_key, username) => {

    this.props.setLoader(true);

    try {
      const source = await fetchDataSource(
        api_key,
        username,
        this.props.match.params.data_source_id,
        this.props.providers,
      );

      const selectedProvider = this.props.providers.find(
        dataProvider => dataProvider.id === source.data_provider_id,
      );

      const parameterFields = extractGlobalParameters(selectedProvider, source.resource);

      this.setState({
        sourceName: source.name,
        data: source.rawData,
        selectedProvider,
        selectedResource: source.resource,
        parameterFields,
        parameterValues: typeof source.params === 'string' ? JSON.parse(source.params) : source.params,
      });

      this.props.setLoader(false);

    } catch(error) {
      this.props.addNotification({ message: error, type: 'error' })
    }
  }

  componentDidMount() {
    const { api_key, username } = this.props.user;
    const sourceIdToEdit = this.props.match.params.data_source_id;

    if (sourceIdToEdit) {
      this.getDataSource(api_key, username, sourceIdToEdit);
    }
  };

  addDataSource = (event) => {
    const { username, api_key } = this.props.user;

    const selectedResource = this.state.selectedResource;
    const selectedProvider = this.state.selectedProvider || null;
    const params = this.state.parameterValues;
    const sourceName = this.state.sourceName;
    const sourceId = this.props.match.params.data_source_id || this.state.newlySavedDataSoucerId;

    event.preventDefault();
    if(selectedResource && sourceName && selectedProvider) {
      try {
        this.props.setLoader(true);
        GenerateRequest(
          selectedProvider,
          selectedResource,
          params,
          this.state.parameterFields,
          sourceId ? parseInt(sourceId) : null,
          username, api_key,
        )
          .then(response => {
            this.setState({
              data: response,
            }, () => {
              this.props.createDataSource(
                api_key,
                username,
                sourceName,
                this.props.match.params.id,
                selectedProvider,
                selectedResource,
                params,
                response,
                response.properties,
                this.props.match.params.data_source_id || this.state.newlySavedDataSoucerId
              ).then(response => {
                this.props.setLoader(false);
                this.setState({ newlySavedDataSoucerId: response });
              });
            });
          }).catch(error => {
            this.props.setLoader(false);
            this.props.addNotification({ message: error.message, type: 'error' })
          });
      } catch(error) {
        this.props.setLoader(false);
        this.props.addNotification({ message: error.message, type: 'error' });
      }

    } else {
      this.props.addNotification({ message: 'Fill out all required data source fields', type: 'error' });
    }
  };

  onProviderChange = (event) => {
    if (event.target.value) {
      // this.props.fetchProvider(event.target.value);
      const selectedProvider = this.props.providers.find(
        provider => provider.id === parseInt(event.target.value)
      );

      this.setState({
        selectedProvider,
        selectedResource: '',
        parameterFields: [],
        parameterValues: [],
      });
    } else {
      this.setState({
        selectedProvider: null,
        selectedResource: '',
        parameterFields: [],
        parameterValues: [],
      });
    }
  };

  onResourceChange = (selection) => {
    if (this.state.selectedProvider && selection.length > 0) {
      let availableFields = [];
      const resourceName = selection[0].id;
      const resourceParams = this.state.selectedProvider.swagger_paths[resourceName].get.parameters;

      if (resourceParams) {
        availableFields = extractGlobalParameters(this.state.selectedProvider, resourceName);
      }

      this.setState({
        selectedResource: resourceName,
        parameterFields: availableFields,
        parameterValues: [],
      });
    } else {
      this.setState({
        parameterFields: [],
        parameterValues: [],
      });
    }
  };

  onParameterChange = (event) => {
    const parameterName = event.target.name;
    const parameterValue = event.target.value;
    const constructedParams = this.state.parameterValues;
    let newParams = [];

    if (parameterValue) {
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
    }

    if (!parameterValue && constructedParams.length > 0) {
      newParams = constructedParams.filter(param => param.name !== parameterName)
    }

    this.setState({ parameterValues: newParams });
  };

  onSourceNameChange = (event) => {
    this.setState({ sourceName: event.target.value });
  };

  render() {

    let parameters = [];
    const selectedResourceLabel = this.state.selectedResource ? this.state.selectedProvider.swagger_paths[this.state.selectedResource].get.summary : '';

    if (this.state.parameterFields.length > 0) {
      parameters = this.state.parameterFields.map(parameterField => {
        const paramValue = this.state.parameterValues.find(parameterValue => parameterValue.name === parameterField.name);
        const val = pathOr(null, ['value'], paramValue);
        switch(parameterField.type) {
          case DATA_TYPES.date:
            return (
              <React.Fragment key={parameterField.name}>
                <DateSelector useVariables={parameterField.useVariables} name={parameterField.name} value={val} onChange={this.onParameterChange} />
              </React.Fragment>
            );
          case DATA_TYPES.int:
            return (
              <React.Fragment key={parameterField.name}>
                <div class="form-group">
                  <label>{parameterField.name}</label>
                  <input defaultValue={val} name={parameterField.name} onKeyUp={this.onParameterChange} type="number" className="form-control" />
                  <small class="form-text text-muted">{parameterField.description}</small>
                </div>
              </React.Fragment>
            );
            case DATA_TYPES.picker:
              return (
                <React.Fragment key={parameterField.name}>
                  <Picker pickedItems={this.state.parameterValues} callBack={this.onParameterChange} label={parameterField.name} items={this.state.selectedProvider.resources[this.state.selectedResource].fields} />
                </React.Fragment>
              );
            case DATA_TYPES.list:
              return (
                <React.Fragment key={parameterField.name}>
                  <div className="form-group">
                    <label>{parameterField.name}</label>
                    <select name={parameterField.name} defaultValue={val} onChange={this.onParameterChange} className="form-control">
                      <option value="">-- Select {parameterField.name} --</option>;
                      {parameterField.options.map((option) => {
                        return <option key={option.value} value={option.value}>{option.label}</option>
                      })}
                    </select>
                  </div>
                </React.Fragment>
              );
          default:
            return (
              <React.Fragment key={parameterField.name}>
                <div class="form-group">
                  <label>{parameterField.name}</label>
                  <input defaultValue={val} name={parameterField.name} onKeyUp={this.onParameterChange} type="text" className="form-control" />
                  <small class="form-text text-muted">{parameterField.description}</small>
                </div>
              </React.Fragment>
            );
        }
      })
    }
    return (
      <>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><Link to={`/charts/${this.props.match.params.id}/data-sources`}>Back to Data Sources</Link></li>
            <li class="breadcrumb-item active" aria-current="page">{this.state.sourceName ? this.state.sourceName : 'Create New'}</li>
          </ol>
        </nav>
        <div className="table-wrapper">
          {this.props.loader ? <Loader /> :
            <Row>
              <Col md={5}>
                <h2>{this.state.sourceName ? this.state.sourceName : 'Create a new data source'}</h2>
                <div className="form-group">
                  <label>Title</label>
                  <input value={this.state.sourceName || ''} onChange={this.onSourceNameChange} type="text" className="form-control" placeholder="Enter a title" />
                </div>
                <div className="form-group">
                  <label>Data Provider</label>
                  <select value={pathOr('', ['id'], this.state.selectedProvider)} onChange={this.onProviderChange} className="form-control" id="dataProvider">
                    <option value="">-- Select a data provider --</option>;
                    {this.props.providers.map((provider) => {
                      if (provider.isConnected) {
                        return <option key={provider.id} value={provider.id}>{provider.name}</option>
                      }
                    })}
                  </select>
                  <small className="form-text text-muted">
                    {/*this.state.selectedProvider ? <a rel="noopener noreferrer" target="_blank" href={this.state.selectedProvider.docs}>Check out the <span style={{ textTransform: 'capitalize' }}>{this.state.selectedProvider.provider}</span> documentation</a> : ''*/}
                  </small>
                </div>
                {this.state.selectedProvider && this.state.selectedProvider.swagger_paths ?
                  <div className="form-group">
                    <label>Resource</label>
                    <Typeahead
                      placeholder='Search and select a resource'
                      defaultInputValue={selectedResourceLabel}
                      onChange={this.onResourceChange}
                      options={Object.keys(this.state.selectedProvider.swagger_paths).filter(r => this.state.selectedProvider.swagger_paths[r].get).map(resourceKey => {
                        const resourceDetails = this.state.selectedProvider.swagger_paths[resourceKey].get;
                        return { id: resourceKey, label: resourceDetails.summary }
                      })}
                    />
                  </div>
                : null
                }
                {parameters}
                {
                  !this.props.match.params.data_source_id && !this.state.newlySavedDataSoucerId ?
                  <button onClick={this.addDataSource} type="submit" className="btn btn-primary mb-2">Add Data Source</button> :
                  <button onClick={this.addDataSource} type="submit" className="btn btn-primary mb-2">Update Data Source</button>
                }
              </Col>
              <Col md={7}>
                {
                  this.state.data ?
                    <JSONTree
                      theme={{
                        tree: ({ style }) => ({
                          style: { ...style, padding: "1em" },
                        }),
                      }}
                      data={this.state.data}
                    /> :
                  null
                }
              </Col>
            </Row>
          }
        </div>
      </>
    )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataSourceDetail);
