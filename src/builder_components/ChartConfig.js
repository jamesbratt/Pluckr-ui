import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSource } from '../actions';
import { GenerateGuid } from '../utils/Helpers';
import { getData } from '../data_sources/Strava';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ChartRuntime from './ChartRuntime';

const mapStateToProps = state => {
  return state
};

class ChartConfig extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedResource: 'activities',
      totalResults: '30',
      sourceName: null,
    };
  }

  addDataSource = (event) => {
    const selectedResource = this.state.selectedResource;
    const noResults = this.state.totalResults;
    const sourceName = this.state.sourceName;
    event.preventDefault();
    if(selectedResource && noResults && sourceName) {
      getData(selectedResource, noResults)
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
    this.setState({ selectedResource: event.target.value });
  }

  onResultsChange = (event) => {
    this.setState({ totalResults: event.target.value });
  }

  onSourceNameChange = (event) => {
    this.setState({ sourceName: event.target.value });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.id !== this.props.id) {
      this.setState({
        sourceName: null,
        totalResults: '30',
      });
    }
  }

  render() {
    const availableSources = this.props.sources.filter((source) => {
      return source.chartId === this.props.id;
    });

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
            <label className="sr-only" for="dataSourceTitle">Title</label>
            <input value={this.state.sourceName || ''} onChange={this.onSourceNameChange} type="text" className="form-control mb-2 mr-sm-2" id="dataSourceTitle" placeholder="Enter a title" />

            <label className="sr-only" for="dataSourceResource">Resource</label>
            <select disabled className="form-control mb-2 mr-sm-2" id="dataSourceResource">
              <option value="actvities">Activities</option>
            </select>

            <label className="sr-only" for="dataSourceResults">No. of results</label>
            <input onKeyUp={this.onResultsChange} type="number" className="form-control mb-2 mr-sm-2" id="dataSourceResults" placeholder="No. of results" />

            <button onClick={this.addDataSource} type="submit" className="btn btn-primary mb-2">Add Data Source</button>
        </form>
        {availableSources.length > 0 ? <ChartRuntime chartId={this.props.id} chartName={this.props.name} sources={availableSources} /> : null}
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(ChartConfig);