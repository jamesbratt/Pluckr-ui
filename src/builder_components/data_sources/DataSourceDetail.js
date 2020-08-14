import React, { Component } from 'react';
import Picker from '../Picker';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import JSONTree from 'react-json-tree';
import DateSelector from './DateSelector';
import Loader from '../../Loader';
import axios from "axios";

import { Link } from "react-router-dom";
import { pathOr } from 'ramda';
import { DATA_TYPES } from '../../Constants';
import { connect } from 'react-redux';
import { createDataSource, fetchDataSources, setLoader } from '../../actions';
import { addNotification } from '../../actions/notification';
import { fetchProvider } from '../../actions/provider';

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
      const provider = dataProviders.find(dataProvider => dataProvider.provider === response.data.provider);

      try {
        const rawData = await provider.request(
          dataSource.resource,
          JSON.parse(dataSource.params),
          username,
          apiKey,
          dataSource.id
        );

        dataSource.rawData = rawData.data;

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
    providers: state.providers,
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
        this.props.dataProviders,
      );

      const selectedProvider = this.props.dataProviders.find(
        dataProvider => dataProvider.provider === source.provider,
      );

      this.setState({
        sourceName: source.name,
        data: source.rawData,
        selectedProvider,
        selectedResource: source.resource,
        parameterFields: selectedProvider.resources[source.resource].parameters,
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
    const selectedProvider = pathOr(null, ['provider'], this.state.selectedProvider);
    const params = this.state.parameterValues;
    const sourceName = this.state.sourceName;

    event.preventDefault();
    if(selectedResource && sourceName && selectedProvider) {
      try {
        this.props.setLoader(true);
        this.state.selectedProvider.request(
          selectedResource,
          params, username, api_key,
          parseInt(this.props.match.params.data_source_id) || parseInt(this.state.newlySavedDataSoucerId)
        )
          .then(response => {
            this.setState({
              data: response.data,
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
      this.props.fetchProvider(event.target.value);
      const selectedProvider = this.props.providers.find(
        provider => provider.provider.id === parseInt(event.target.value)
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
                  <input defaultValue={val} name={parameterField.name} onKeyUp={this.onParameterChange} type="number" className="form-control" placeholder={parameterField.name} />
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
                  <input defaultValue={val} name={parameterField.name} onKeyUp={this.onParameterChange} type="text" className="form-control" placeholder={parameterField.name} />
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
                  <select value={pathOr('', ['provider', 'id'], this.state.selectedProvider)} onChange={this.onProviderChange} className="form-control" id="dataProvider">
                    <option value="">-- Select a data provider --</option>;
                    {this.props.providers.map((provider) => {
                      if (provider.provider.isConnected) {
                        return <option key={provider.provider.id} value={provider.provider.id}>{provider.provider.name}</option>
                      }
                    })}
                  </select>
                  <small className="form-text text-muted">
                    {/*this.state.selectedProvider ? <a rel="noopener noreferrer" target="_blank" href={this.state.selectedProvider.docs}>Check out the <span style={{ textTransform: 'capitalize' }}>{this.state.selectedProvider.provider}</span> documentation</a> : ''*/}
                  </small>
                </div>
                {this.state.selectedProvider && this.state.selectedProvider.provider.swagger_paths ?
                  <div className="form-group">
                    <label>Resource</label>
                    <select value={this.state.selectedResource} onChange={this.onResourceChange} className="form-control" id="dataSourceResource">
                      <option value="">-- Select a resource --</option>;
                      {Object.keys(this.state.selectedProvider.provider.swagger_paths).filter(r => this.state.selectedProvider.provider.swagger_paths[r].get).map(resourceKey => {
                        const resourceDetails = this.state.selectedProvider.provider.swagger_paths[resourceKey].get;
                        return <option key={resourceKey} value={resourceKey}>{resourceDetails.summary}</option>
                      })}
                    </select>
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
