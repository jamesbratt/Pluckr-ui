import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSource } from '../actions'; 

const mapStateToProps = state => {
  return state
};

class ChartConfig extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedResource: '',
      selectedFilters: [],
    };
  }

  addDataSource = (event) => {
    event.preventDefault();
    this.props.dispatch(
      addSource(
        this.props.id,
        this.state.selectedResource,
        this.state.selectedFilters,
      )
    );
  }

  onResourceChange = (event) => {
    this.setState({ selectedResource: event.target.value });
  }

  onFilterChange = (event) => {
    const filters = event.target.options;
    const selectedFilters = [];
    for (var i = 0, l = filters.length; i < l; i++) {
      if (filters[i].selected) {
        selectedFilters.push(filters[i].value);
      }
    }
    this.setState({ selectedFilters: selectedFilters });
  }

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
            <select onChange={this.onResourceChange}>
              <option value="actvities">Activities</option>
              <option value="club_activities">Club Activities</option>
            </select>
          </div>
          <div>
            <select onChange={this.onFilterChange} multiple>
              <option value="before">Before</option>
              <option value="after">After</option>
            </select>
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