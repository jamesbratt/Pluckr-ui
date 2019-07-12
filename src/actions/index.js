import { assocPath, clone, merge } from 'ramda';
import { executeOperations } from '../data_parsing/parse';

// USERS
export const receiveUser = (userData) => {
  return {
    type: 'RECEIVE_USER',
    userData
  }
};

export const fetchUser = (username, password) => {
  return dispatch => {
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/authentication/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then((response) => {
      if(response.status >= 200 && response.status <= 300) {
        return response.json();
      } else {
        throw Error('Invalid username or password');
      }
    })
    .then(json => {
      localStorage.setItem('pluckr_token', JSON.stringify(json));
      dispatch(receiveUser(json))
    })
    .catch(error => alert(error));
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
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/chart/`, {
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
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/chart/`, {
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
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/chart/${chartId}/`, {
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

// DATA SOURCES
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
  
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/datasource/?chart=${chartId}`, {
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
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/datasource/`, {
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

export const removeDataset = (datasetId) => {
  return {
    type: 'REMOVE_DATASET',
    datasetId,
  }
};

export const updateDataset = (datasetId, rawData) => {
  return {
    type: 'UPDATE_DATASET',
    datasetId,
    rawData
  }
}

export const fetchDatasets = (apiKey, username, chartId) => {
  return dispatch => {
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dataset/?chart=${chartId}`, {
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
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dataset/`, {
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

export const deleteDataset = (apiKey, username, datasetId) => {

  return dispatch => {
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dataset/${datasetId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${username}:${apiKey}`
        },
    })
    .then(() => {
      dispatch(removeDataset(datasetId))
    })
  }
}

export const runDataSet = (
  apiKey,
  username,
  dataSetId,
  callback,
  seriesType,
) => {

  return (dispatch, getState) => {

    const { datasets, operations, sources } = getState();

    let data = [];
    const currentDataSet = datasets.find(dataset => dataset.id === dataSetId);
    const currentOperations = operations.filter(operation => operation.dataset === dataSetId);

    const currentDataSource = sources.find(
      source => source.id === parseInt(currentDataSet.data_source),
    );

    // Having to clone the source data here as for some reason
    // the highcharts api is mutating the raw data in the sources store
    const clonedData = clone(currentDataSource.rawData);

    try {
      data = executeOperations(
        clonedData,
        currentDataSet,
        currentOperations,
      );
    } catch (error) {
      alert(error);
    }

    // Because the api is dehydrating these fields
    // we need to add them into a PATCH payload
    // TODO find solution for this on the api
    const payload = {
      chart: {pk: currentDataSet.chart},
      data_source: {pk: currentDataSet.data_source},
      data: JSON.stringify(data),
    };
    
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dataset/${dataSetId}/`, {
      method: 'PATCH',
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
          updateDataset(
            dataSetId,
            json.data,
          )
        )

        callback(
          currentDataSet.id,
          currentDataSet.name,
          data,
          seriesType,
        );
      })
      .catch(error => alert(error));
  }
}

// OPERATIONS
export const receiveOperations = (data) => {
  return {
    type: 'RECEIVE_OPERATIONS',
    data,
  }
};

export const addOperation = (data) => {
  return {
    type: 'ADD_OPERATION',
    data,
  }
};

export const removeOperation = (operationId) => {
  return {
    type: 'REMOVE_OPERATION',
    operationId,
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

export const fetchOperations = (apiKey, username) => {
  return dispatch => {
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/operation/`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${apiKey}`
      },
    })
      .then(response => response.json())
      .then(json => {
        const operations = json.objects.length > 0 ? json.objects.map(operation => {
          return assocPath(['ast'], JSON.parse(operation.ast), operation);
        }) : json.objects;
        dispatch(receiveOperations(operations))
      })
  }
}

export const deleteOperation = (apiKey, username, operationId) => {

  return dispatch => {
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/operation/${operationId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${username}:${apiKey}`
        },
    })
    .then(() => {
      dispatch(removeOperation(operationId))
    })
  }
}

export const createOperation = (
  apiKey,
  username,
  dataSetId,
  rootFunction,
  ast,
  sortOrder,
) => {

  const payload = {
    name: '',
    dataset: { pk: dataSetId },
    root_function: rootFunction,
    ast: JSON.stringify(ast),
    sort_order: sortOrder,
  };

  return dispatch => {
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/operation/`, {
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
      json['ast'] = JSON.parse(json.ast);
      dispatch(
        addOperation(
          json,
        )
      )
    })
    .catch(error => alert(error));
  }
}

export const updateOperationAst = (
  apiKey,
  username,
  operationId,
  root_function,
  ast,
) => {

  return (dispatch, getState) => {

    const { operations } = getState();

    const currentOperation = operations.find(operation => operation.id === operationId);

    // Because the api is dehydrating these fields
    // we need to add them into a PATCH payload
    // TODO find solution for this on the api
    const payload = {
      dataset: {pk: currentOperation.dataset},
      root_function,
      ast: JSON.stringify(ast),
    };
    
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/operation/${operationId}/`, {
      method: 'PATCH',
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
        json['ast'] = JSON.parse(json.ast);
        dispatch(
          updateOperation(
            operationId,
            json.root_function,
            json.ast,
          )
        )
      })
      .catch(error => alert(error));
  }
}

// DATA PROVIDERS
export const setDataProviders = (payload) => {
  return {
    type: 'SET_PROVIDERS',
    payload,
  }
};