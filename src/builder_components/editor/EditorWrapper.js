import * as React from "react";
import Loader from '../../Loader';
import Chart from './Chart';
import axios from "axios";

import { createDataSet, setDataSets } from '../../actions/dataset';
import { setLoader } from '../../actions';
import { providers } from '../../ProviderConstants';
import { executeOperations } from '../../data_parsing/parse';
import { connect } from 'react-redux';
import { fetchCharts } from '../../actions/chart';

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
        const rawData = responses.length > 1 ? responses.reduce((acc, curr) => {
          acc.push(curr.data);
          return acc;
        }, []) : responses[0].data;

        return { ...dataset, rawData };
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
        dataset.rawData,
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

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    charts: state.charts,
    sources: state.sources.data,
    datasets: state.datasets,
    loader: state.loader,
  };
};

const mapDispatchToProps = {
  fetchCharts,
  setLoader,
  setDataSets,
};

class EditorWrapper extends React.Component {

  getDataSets = async (chartId) => {
    const user = this.props.user.username;
    const apiKey = this.props.user.api_key;

    const datasets = await fetchDataSets(chartId, user, apiKey);
    const processedDatasets = await transformData(datasets, user, apiKey);
    this.props.setDataSets(processedDatasets);

    if (this.props.charts.length === 0) {
      this.props.fetchCharts(
          apiKey,
          user,
        )
    } else {
      this.props.setLoader(false);
    }
  }

  componentDidMount() {
    this.props.setLoader(true);
    this.getDataSets(this.props.match.params.id);
  }

  render() {
    return (
      <>
        {this.props.loader || this.props.charts.length === 0 ? <Loader /> :
          <Chart {...this.props} />}
      </>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorWrapper);