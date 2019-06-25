import { assocPath, merge } from 'ramda';

// USERS

export const receiveUser = (userData) => {
  return {
    type: 'RECEIVE_USER',
    userData
  }
};

export const fetchUser = (username, password) => {
  return dispatch => {
    return fetch('https://api.pluckr.io/api/v1/authentication/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then((response) => {
      return response.json();
    })
    .then(json => {
      localStorage.setItem('pluckr_token', JSON.stringify(json));
      dispatch(receiveUser(json))
    })
  }
}

// CHARTS

export const addChart = (data) => {
  return {
    type: 'ADD_CHART',
    data,
  }
};

export const removeChart = (chartId) => {
  return {
    type: 'REMOVE_CHART',
    chartId,
  }
};

export const receiveCharts = (data) => {
  return {
    type: 'RECEIVE_CHARTS',
    data
  }
};

export const fetchCharts = (apiKey, username) => {
  return dispatch => {
    return fetch(`https://api.pluckr.io/api/v1/chart/`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${apiKey}`
      },
    })
      .then(response => response.json())
      .then(json => dispatch(receiveCharts(json.objects)))
  }
}

export const createChart = (apiKey, username, name, chart_type) => {

  let series_type;
  if (chart_type === 'linear') {
    series_type = 'line';
  }

  if (chart_type === 'datetime') {
    series_type = 'line';
  }

  if (chart_type === 'category') {
    series_type = 'bar';
  }

  const payload = {
    name,
    chart_type,
    series_type,
  };

  return dispatch => {
    return fetch('https://api.pluckr.io/api/v1/chart/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${username}:${apiKey}`
        },
        body: JSON.stringify(payload)
    })
    .then((response) => {
      return response.json();
    })
    .then(json => {
      dispatch(addChart(json))
    })
  }
}

export const deleteChart = (apiKey, username, chartId) => {

  return dispatch => {
    return fetch(`https://api.pluckr.io/api/v1/chart/${chartId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${username}:${apiKey}`
        },
    })
    .then(() => {
      dispatch(removeChart(chartId))
    })
  }
}

export const updateChartXaxis = (id, axisType) => {
  return {
    type: 'UPDATE_CHART_XAXIS',
    id,
    axisType,
  }
};

export const makeChartActive = (id, isActive) => {
  return {
    type: 'MAKE_CHART_ACTIVE',
    id,
    isActive,
  }
};

// Data Sources

export const addSource = (id, sourceName, chartId, resource, params, data, properties) => {
  return {
    type: 'ADD_SOURCE',
    id,
    sourceName,
    chartId,
    resource,
    params,
    data,
    properties,
  }
};

export const receiveDataSources = (data) => {
  return {
    type: 'RECEIVE_DATA_SOURCES',
    data
  }
};

export const fetchDataSources = (apiKey, username, chartId) => {
  return (dispatch, getState) => {
    const { dataProviders } = getState();
  
    return fetch(`https://api.pluckr.io/api/v1/datasource/?chart=${chartId}`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${apiKey}`
      },
    })
      .then(response => response.json())
      .then(json => {
        const dataSources = json.objects;
        if (dataSources.length > 0) {
          const dataSourceRequests = dataSources.map(dataSource => {
            const provider = dataProviders.find(dataProvider => dataProvider.provider === dataSource.provider);
              return provider.request(dataSource.resource, JSON.parse(dataSource.params), dataSource.id);
          });

          Promise.all(dataSourceRequests).then(responses => {
            const dataSourcesToAddToState = [];
            responses.forEach(response => {
              const sourceConfig = dataSources.find(dataSource => dataSource.id === response.sourceId);
              sourceConfig['chart'] = parseInt(sourceConfig.chart.replace('/api/v1/chart/', '').replace('/', ''));
              const source = {
                rawData: response.data,
                properties: response.properties,
              };

              dataSourcesToAddToState.push(merge(sourceConfig, source));
            });

            dispatch(
              receiveDataSources(
                dataSourcesToAddToState
              )
            );
          });

        } else {
          dispatch(
            receiveDataSources(
              dataSources
            )
          );
        }
      })
      .catch(error => alert(error));
  }
}

export const createDataSource = (
  apiKey,
  username,
  name,
  chartId,
  provider,
  resource,
  params,
  rawData,
  properties,
) => {

  const payload = {
    name,
    chart: { pk: chartId },
    provider,
    resource,
    params: JSON.stringify(params),
  };

  return dispatch => {
    return fetch('https://api.pluckr.io/api/v1/datasource/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${username}:${apiKey}`
        },
        body: JSON.stringify(payload)
    })
    .then((response) => {
      return response.json();
    })
    .then(json => {
      dispatch(
        addSource(
          json.id,
          json.name,
          json.chart,
          json.resource,
          JSON.parse(json.params),
          rawData,
          properties,
        )
      )
    })
    .catch(error => alert(error));
  }
}

// DATASETS

export const receiveDatasets = (data) => {
  return {
    type: 'RECEIVE_DATASETS',
    data
  }
};

export const addDataset = (data) => {
  return {
    type: 'ADD_DATASET',
    data,
  }
};

export const fetchDatasets = (apiKey, username, chartId) => {
  return dispatch => {
    return fetch(`https://api.pluckr.io/api/v1/dataset/?chart=${chartId}`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${apiKey}`
      },
    })
      .then(response => response.json())
      .then(json => {
        const datasets = json.objects.map(dataset => {
          return assocPath(['data'], JSON.parse(dataset.data), dataset);
        });
        dispatch(receiveDatasets(datasets))
      })
  }
}

export const createDataSet = (
  apiKey,
  username,
  name,
  chartId,
  sourceId,
  data,
) => {

  const payload = {
    name,
    chart: { pk: chartId },
    data_source: { pk: sourceId },
    y_axis_id: null,
    data: JSON.stringify(data),
  };

  return dispatch => {
    return fetch('https://api.pluckr.io/api/v1/dataset/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${username}:${apiKey}`
        },
        body: JSON.stringify(payload)
    })
    .then((response) => {
      return response.json();
    })
    .then(json => {
      json['data'] = JSON.parse(json.data);
      dispatch(
        addDataset(
          json,
        )
      )
    })
    .catch(error => alert(error));
  }
}

export const makeDatasetActive = (id, isActive) => {
  return {
    type: 'MAKE_DATASET_ACTIVE',
    id,
    isActive,
  }
};

export const updateDatasetYaxis = (id, yaxisId) => {
  return {
    type: 'UPDATE_DATASET_YAXIS',
    id,
    yaxisId,
  }
};

export const runDataset = (datasetId, rawData) => {
  return {
    type: 'RUN_DATASET',
    datasetId,
    rawData
  }
}

export const addOperation = (id, dataSetId, rootFunction, ast) => {
  return {
    type: 'ADD_OPERATION',
    id,
    dataSetId,
    rootFunction,
    ast,
  }
};

export const updateOperation = (id, rootFunction, ast) => {
  return {
    type: 'UPDATE_OPERATION',
    id,
    rootFunction,
    ast,
  }
};

export const setDataProviders = (payload) => {
  return {
    type: 'SET_PROVIDERS',
    payload,
  }
};