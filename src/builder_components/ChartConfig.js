import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSource } from '../actions';
import { getData } from '../data_sources/Strava';

const mapStateToProps = state => {
  return state
};

class ChartConfig extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedResource: 'activities',
      totalResults: '30',
    };
  }

  addDataSource = (event) => {
    const selectedResource = this.state.selectedResource;
    const noResults = this.state.totalResults;
    event.preventDefault();
    getData(selectedResource, noResults)
      .then(data => {
        this.props.dispatch(
          addSource(
            this.props.id,
            selectedResource,
            data,
          )
        );
      })
  }

  onResourceChange = (event) => {
    this.setState({ selectedResource: event.target.value });
  }

  onResultsChange = (event) => {
    this.setState({ totalResults: event.target.value });
  }

  /*onFilterChange = (event) => {
    const filters = event.target.options;
    const selectedFilters = [];
    for (var i = 0, l = filters.length; i < l; i++) {
      if (filters[i].selected) {
        selectedFilters.push(filters[i].value);
      }
    }
    this.setState({ selectedFilters: selectedFilters });
  }*/

  render() {
    return (
      <div>
        <ul>
          {this.props.sources.map(source => {
            if(source.chartId === this.props.id) {
              return <li>{source.chartId}</li>;
            }
          })}
        </ul>
        <form onSubmit={this.addDataSource}>
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
            <button>Add a Data Source</button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(ChartConfig);