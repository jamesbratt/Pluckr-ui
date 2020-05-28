import { assocPath } from 'ramda';
import { getTokenId } from '../utils/Helpers';
import { addNotification } from './notification';
import axios from "axios";

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
      dispatch(receiveUser(json));
    })
    .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
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

export const updateSource = (id, sourceName, chartId, provider, resource, params, data, properties) => {
  return {
    type: 'UPDATE_SOURCE',
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

export const receiveSingleDataSource = (data) => {
  return {
    type: 'RECEIVE_SINGLE_DATA_SOURCE',
    data
  }
};

export const deleteDataSource = (apiKey, username, datasourceId) => {

  return dispatch => {
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/datasource/${datasourceId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${username}:${apiKey}`
        },
    })
    .then(() => {
      dispatch({
        type: 'DELETE_DATA_SOURCE',
        datasourceId,
      })
    })
    .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
  }
}

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
        dispatch(
          receiveDataSources(
            dataSources
          )
        );
        dispatch(setLoader(false));
      })
      .catch(error => {
        dispatch(addNotification({ message: error.message, type: 'error' }));
        dispatch(setLoader(false));
      });
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
  id,
) => {

  const integration_id = getTokenId(provider);

  const payload = {
    name,
    chart: { pk: chartId },
    provider,
    resource,
    params: JSON.stringify(params),
    integration_auth: integration_id ? { pk: integration_id } : null,
  };

  return (dispatch, getState) => {
    const options = {
      method: id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${username}:${apiKey}`
      },
      data: JSON.stringify(payload),
      url: `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/datasource/${id ? id + '/' : ''}`,
    };
    return axios(options)
    .then(response => {
      dispatch(
        !id ? addSource(
          response.data.id,
          response.data.name,
          response.data.chart,
          response.data.provider,
          response.data.resource,
          JSON.parse(response.data.params),
          rawData.data,
          properties,
        ) : updateSource(
          response.data.id,
          response.data.name,
          response.data.chart,
          response.data.provider,
          response.data.resource,
          JSON.parse(response.data.params),
          rawData.data,
          properties,
        )
      );

      return Promise.resolve(response.data.id);
    })
    .catch(error => {
      dispatch(addNotification({ message: error.error.message, type: 'error' }));
    });
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

export const fetchOperations = (apiKey, username, datasetId) => {
  return dispatch => {
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/operation/?dataset=${datasetId}`, {
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
      .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
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
    .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
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
    dataset: `/api/v1/dataset/${dataSetId}/`,
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
    .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
  }
}

export const updateOperationAst = (
  apiKey,
  username,
  operationId,
  root_function,
  ast,
) => {

  return (dispatch) => {

    const payload = {
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
      .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
  }
}

// DATA PROVIDERS
export const setDataProviders = (payload) => {
  return {
    type: 'SET_PROVIDERS',
    payload,
  }
};