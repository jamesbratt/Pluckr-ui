import React, { Component } from 'react';
import Picker from '../Picker';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import JSONTree from 'react-json-tree';
import DateSelector from './DateSelector';
import Loader from '../../Loader';
import { pathOr } from 'ramda';
import { DATA_TYPES } from '../../Constants';
import { connect } from 'react-redux';
import { createDataSource } from '../../actions';
import { addNotification } from '../../actions/notification';

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    dataProviders: state.dataProviders,
    sources: state.sources.data,
    loader: state.loader,
  };
};

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

  componentDidMount() {
    const { sources, dataProviders } = this.props;

    if(this.props.match.params.data_source_id) {
      const dataSource = sources.find(source => source.id === parseInt(this.props.match.params.data_source_id));
      const selectedProvider = dataProviders.find(
        dataProvider => dataProvider.provider === dataSource.provider,
      );
      this.setState({
        sourceName: dataSource.name,
        data: dataSource.rawData,
        selectedProvider,
        selectedResource: dataSource.resource,
        parameterFields: selectedProvider.resources[dataSource.resource].parameters,
        parameterValues: typeof dataSource.params === 'string' ? JSON.parse(dataSource.params) : dataSource.params,
      })
    }
  }

  addDataSource = (event) => {
    const { username, api_key } = this.props.user;

    const selectedResource = this.state.selectedResource;
    const selectedProvider = pathOr(null, ['provider'], this.state.selectedProvider);
    const params = this.state.parameterValues;
    const sourceName = this.state.sourceName;

    event.preventDefault();
    if(selectedResource && sourceName && selectedProvider) {
      try {
        this.state.selectedProvider.request(
          selectedResource,
          params, username, api_key,
          parseInt(this.props.match.params.data_source_id) || parseInt(this.state.newlySavedDataSoucerId)
        )
          .then(response => {
            this.setState({
              data: response.data,
            }, () => {
              this.props.dispatch(createDataSource(
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
              )).then(response => this.setState({ newlySavedDataSoucerId: response }));
            });
          }).catch(error => this.props.dispatch(addNotification({ message: error.message, type: 'error' })));
      } catch(error) {
        this.props.dispatch(addNotification({ message: error.message, type: 'error' }));
      }

    } else {
      this.props.dispatch(addNotification({ message: 'Fill out all required data source fields', type: 'error' }));
    }
  };

  onProviderChange = (event) => {
    if (event.target.value) {
      const selectedProvider = this.props.dataProviders.find(
        dataProvider => dataProvider.provider === event.target.value
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
            case DATA_TYPES.list:
              return (
                <React.Fragment key={parameterField.name}>
                  <Picker pickedItems={this.state.parameterValues} callBack={this.onParameterChange} label={parameterField.name} items={this.state.selectedProvider.resources[this.state.selectedResource].fields} />
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
      <React.Fragment>
        <Row>
          <Col md={5}>
            <div className="form-group">
              <label>Title</label>
              <input value={this.state.sourceName || ''} onChange={this.onSourceNameChange} type="text" className="form-control" placeholder="Enter a title" />
            </div>
            <div className="form-group">
              <label>Data Provider</label>
              <select value={pathOr('', ['provider'], this.state.selectedProvider)} onChange={this.onProviderChange} className="form-control" id="dataProvider">
                <option value="">-- Select a data provider --</option>;
                {this.props.dataProviders.map((dataProvider) => {
                  if (dataProvider.isActive) {
                    return <option key={dataProvider.provider} value={dataProvider.provider}>{dataProvider.provider}</option>
                  }
                })}
              </select>            
            </div>
            {this.state.selectedProvider ?
              <div className="form-group">
                <label>Resource</label>
                <select value={this.state.selectedResource} onChange={this.onResourceChange} className="form-control" id="dataSourceResource">
                  <option value="">-- Select a resource --</option>;
                  {Object.keys(this.state.selectedProvider.resources).map(resourceKey => {
                    return <option key={this.state.selectedProvider.resources[resourceKey].name} value={this.state.selectedProvider.resources[resourceKey].name}>{this.state.selectedProvider.resources[resourceKey].label}</option>
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
              <>
                {this.props.loader ? <Loader /> :
                <JSONTree
                  theme={{
                    tree: ({ style }) => ({
                      style: { ...style, padding: "1em" }, 
                    }),
                  }}
                  data={this.state.data}
                />}
               </> :
              null
            }
          </Col>
        </Row>
      </React.Fragment>
    )
  };
};

export default connect(
  mapStateToProps,
)(DataSourceDetail);
