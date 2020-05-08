import React, { Component } from 'react';

const fetchDataSets = async (chartId) => {

  try {
    const datasets = await [];

    const vizData = datasets.map(async (dataset) => {
      const operations = await [];
      return {
        ...dataset,
        data: operations
      };
    });

    return Promise.all(vizData);

  } catch(error) {

  }
}

class Visualisation extends Component {

  state = {
    viz: null,
  };

  componentDidMount() {
    const { id } = this.props.config.chart;
    fetchDataSets(id);
  }

  render() {
    const { id } = this.props.config;
    return (
      <div id={`viz-${id}`}></div>
    )
  }
}

export default Visualisation;