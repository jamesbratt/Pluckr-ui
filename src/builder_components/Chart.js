import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSource } from '../actions';
import { GenerateGuid } from '../utils/Helpers';
import { getData, STRAVA_RESOURCES } from '../data_sources/Strava';
import ChartRuntime from './ChartRuntime';
import { DATA_TYPES } from '../Constants';

const mapStateToProps = state => {
  return state
};

class Chart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedResource: null,
      sourceName: null,
      parameterFields: [],
      parameterValues: [],
    };
  }

  addDataSource = (event) => {
    const selectedResource = this.state.selectedResource;
    const params = this.state.parameterValues;
    const sourceName = this.state.sourceName;
    event.preventDefault();
    if(selectedResource && sourceName) {
      getData(selectedResource, params)
        .then(response => {
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
        })
    } else {
      alert('Fill out all required data source fields');
    }
  }

  onResourceChange = (event) => {
    let availableFields = [];
    const resourceName = event.target.value;
    const resourceParams = STRAVA_RESOURCES[resourceName].parameters;

    if (resourceParams) {
      availableFields = resourceParams;
    }

    this.setState({
      selectedResource: resourceName,
      parameterFields: availableFields,
    });
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
                <label className="sr-only">{parameterField.name}</label>
                <input name={parameterField.name} onChange={this.onParameterChange} type="date" className="form-control mb-2 mr-sm-2" placeholder={parameterField.name} />
              </React.Fragment>
            );
          case DATA_TYPES.int:
            return (
              <React.Fragment>
                <label className="sr-only">{parameterField.name}</label>
                <input name={parameterField.name} onKeyUp={this.onParameterChange} type="number" className="form-control mb-2 mr-sm-2" placeholder={parameterField.name} />
              </React.Fragment>
            );
        }
      })
    }

    return (
      <div id="chart-config">
        <div id="data-sources">
          <ul className="list-inline">
            {this.props.sources.map(source => {
              if(source.chartId === this.props.id) {
                return <li className="list-inline-item">{source.name}</li>;
              }
            })}
          </ul>
        </div>
        <form className="form-inline">
            <label className="sr-only">Title</label>
            <input value={this.state.sourceName || ''} onChange={this.onSourceNameChange} type="text" className="form-control mb-2 mr-sm-2" id="dataSourceTitle" placeholder="Enter a title" />

            <label className="sr-only">Resource</label>
            <select onChange={this.onResourceChange} className="form-control mb-2 mr-sm-2" id="dataSourceResource">
              <option value={null} hidden>-- Select a resource --</option>;
              {Object.keys(STRAVA_RESOURCES).map(resourceKey => {
                return <option value={STRAVA_RESOURCES[resourceKey].name}>{STRAVA_RESOURCES[resourceKey].label}</option>
              })}
            </select>

            {parameters}

            <button onClick={this.addDataSource} type="submit" className="btn btn-primary mb-2">Add Data Source</button>
        </form>
        {availableSources.length > 0 ? <ChartRuntime chartId={this.props.id} chartName={this.props.name} sources={availableSources} chartConfig={this.props.chartConfig} /> : null}
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(Chart);