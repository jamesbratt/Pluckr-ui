import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSource } from '../actions';
import { GenerateGuid } from '../utils/Helpers';
import { getData } from '../data_sources/Strava';
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
      <div>
        <h2>Data Sources</h2>
        <ul>
          {this.props.sources.map(source => {
            if(source.chartId === this.props.id) {
              return <li>{source.name}</li>;
            }
          })}
        </ul>
        <form onSubmit={this.addDataSource}>
          <div>
            <input type="text" value={this.state.sourceName || ''} onChange={this.onSourceNameChange} />
          </div>
          <div>
            <select disabled onChange={this.onResourceChange}>
              <option value="actvities">Activities</option>
              <option value="club_activities">Club Activities</option>
            </select>
          </div>
          <div>
            <input type="number" onKeyUp={this.onResultsChange} />
          </div>
          <div>
            <button className="btn">Add a Data Source</button>
          </div>
        </form>
        {availableSources.length > 0 ? <ChartRuntime chartId={this.props.id} chartName={this.props.name} sources={availableSources} /> : null}
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(ChartConfig);