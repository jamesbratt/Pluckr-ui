import React, { Component } from 'react';
import axios from "axios";

import { executeOperations } from '../../data_parsing/parse';
import { connect } from 'react-redux';
import { providers } from '../../ProviderConstants';
import { defineChartConfig } from '../editor/Graph';

const Highcharts = require('highcharts');

const fetchDataSets = async (chartId, username, apiKey) => {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `ApiKey ${username}:${apiKey}`
  };

  try {

    const datasets = await axios({
      method: 'GET',
      headers,
      url: `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dataset/?chart=${chartId}`,
    });

    const vizData = datasets.data.objects.map(async (dataset) => {

      const dataSources = dataset.sources;

      const rawData = dataSources.map((source) => {
        const provider = providers.find(provider => provider.provider === source.provider);
        return provider.request(
          source.resource,
          JSON.parse(source.params),
          username,
          apiKey,
          source.id
        ).catch((error) => {});
      });

      return Promise.all(rawData).then(responses => {
        const data = responses.length > 1 ? responses.reduce((acc, curr) => {
          acc.push(curr.data);
          return acc;
        }, []) : responses[0].data;

        return { ...dataset, data };
      });

    });

    return Promise.all(vizData).then(responses => {
      return responses;
    });

  } catch(error) {

  }
}

const transformData = async (datasets, username, apiKey) => {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `ApiKey ${username}:${apiKey}`
  };

  const transformedData = datasets.map(async (dataset) => {
    const operations = await axios({
      method: 'GET',
      headers,
      url: `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/operation/?dataset=${dataset.id}`,
    });

    const processedOperations = operations.data.objects.map(operation => {
      return {
        ...operation,
        ast: JSON.parse(operation.ast),
      };
    }).sort(function(a, b) {
      return a.sort_order - b.sort_order;
    });

    try {
      const data = executeOperations(
        dataset.data,
        dataset,
        processedOperations,
      );

      return {
        ...dataset,
        data
      };

    } catch(error) {
        console.error(error);
    };
  });

  return Promise.all(transformedData).then(responses => {
    return responses;
  });
}

class Visualisation extends Component {

  state = {
    viz: null,
  };

  fetchData = async (id, user, apiKey) => {
    const { chart } = this.props.config;
    const datasets = await fetchDataSets(id, user, apiKey);
    const datasetsProcessed = await transformData(datasets, user, apiKey);

    const chartConfig = defineChartConfig(chart);
    chartConfig['series'] = [];
    datasetsProcessed.forEach((dataset) => {

      let series = null;

      const { y_axis_title, y_axis_enabled, y_axis_is_opposite } = dataset;

      if (y_axis_title && y_axis_enabled) {
        const axis = {
          title: {
              text: y_axis_title,
              style: {
                color: chart.color
            }
          },
          opposite: y_axis_is_opposite,
          gridLineWidth: 0,
          minorGridLineWidth: 0,
          labels: {
            style: {
                color: chart.color
            }
          },
          lineColor: chart.color,
          tickColor: chart.color,
        };

        series = {
          name: dataset.name,
          type: chart.series_type,
          data: dataset.data,
          color: dataset.color ? dataset.color : null,
          yAxis: axis,
        }
      } else {
        series = {
          name: dataset.name,
          type: chart.series_type,
          data: dataset.data,
          color: dataset.color ? dataset.color : null,
          yAxis: 0,
        };
      }

      chartConfig.series.push(series);
    })

    Highcharts.chart(
      `viz-${chart.id}`,
      chartConfig
    );

  }

  componentDidMount() {
    const { id } = this.props.config.chart;
    const user = this.props.user.username;
    const apiKey = this.props.user.api_key;
    this.fetchData(id, user, apiKey);
  }

  render() {
    const { id } = this.props.config.chart;
    return (
      <div style={{ height: '400px' }} id={`viz-${id}`}></div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
  };
};


export default connect(mapStateToProps)(Visualisation);