import { assocPath, merge } from 'ramda';

// USERS
export const setLoader = (isLoading) => {
  return {
    type: 'SET_LOADER',
    isLoading
  }
};

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
export const addSource = (id, sourceName, chartId, provider, resource, params, data, properties) => {
  return {
    type: 'ADD_SOURCE',
    id,
    sourceName,
    chartId,
    provider,
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
    dispatch(setLoader(true));
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
              return provider.request(
                dataSource.resource,
                JSON.parse(dataSource.params),
                username,
                apiKey,
                dataSource.id
              );
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
            dispatch(setLoader(false));
          });

        } else {
          dispatch(
            receiveDataSources(
              dataSources
            )
          );
          dispatch(setLoader(false));
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
    dispatch(setLoader(true));
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
          json.provider,
          json.resource,
          JSON.parse(json.params),
          rawData,
          properties,
        )
      );
      dispatch(setLoader(false));
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
      dispatch(removeOperation(operationId));
      return Promise.resolve();
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
      return Promise.resolve();
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
        );
        return Promise.resolve();
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