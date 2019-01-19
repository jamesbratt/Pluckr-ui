import React, { Component } from 'react';

class DataSetConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProperties: [],
      selectedDataSource: '',
      selectedDataProperty: '',
    };
  }

  onDataSourceChange = (event) => {
    this.setState({ selectedDataSource: event.target.value });
  }

  onPropertyChange = (event) => {
    this.setState({ selectedDataProperty: event.target.value });
  }

  render() {
    return (
      <form>
        <h2>Data Sets</h2>
        <div>
          <select onChange={this.getSourceData}>
            {this.props.sources.map(source => {
              if(source.chartId === this.props.chartId) {
                return <option value={source.id}>{source.name}</option>;
              }
            })}
          </select>
        </div>
        <div>
          <button>Add a Data Set</button>
        </div>
      </form>
    );
  }
}

export default DataSetConfig;