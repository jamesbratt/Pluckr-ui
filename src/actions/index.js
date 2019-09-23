import { assocPath, merge } from 'ramda';
import { executeOperations } from '../data_parsing/parse';
import { getTokenId } from '../utils/Helpers';
import { diff } from 'deep-object-diff';
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
      dispatch(receiveUser(json))
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

export const receiveDataSources = (data) => {
  return {
    type: 'RECEIVE_DATA_SOURCES',
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
        if (dataSources.length > 0) {
          const dataSourcesToAddToState = [];
          const dataSourceRequests = dataSources.map(dataSource => {
            const provider = dataProviders.find(dataProvider => dataProvider.provider === dataSource.provider);
              
            return provider.request(
              dataSource.resource,
              JSON.parse(dataSource.params),
              username,
              apiKey,
              dataSource.id
            ).catch((error) => {
              dataSourcesToAddToState.push(dataSource);
              dispatch(
                receiveDataSources(
                  dataSourcesToAddToState
                )
              );
              dispatch(setLoader(false));
              dispatch(addNotification({ message: `Error from data provider: ${error.message}`, type: 'error' }));
            });
            
          });

          Promise.all(dataSourceRequests).then(responses => {
            
            responses.forEach(response => {
              const sourceConfig = dataSources.find(dataSource => dataSource.id === response.sourceId);
              const source = {
                rawData: response.data,
                properties: response.properties,
              };

              dataSourcesToAddToState.push(merge(sourceConfig, source));
            });

            console.log('fetching datasets');

            fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dataset/?chart=${chartId}`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `ApiKey ${username}:${apiKey}`
              },
            })
              .then(response => response.json())
              .then(response => {
                console.log('datasets received');
                const datasetDataUpdates = response.objects.map(dataset => {
                  const latestData = dataSourcesToAddToState.find(source => source.id === dataset.data_source);

                  console.log('fetching operations for ' + dataset.name);

                  return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/operation/?dataset=${dataset.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `ApiKey ${username}:${apiKey}`
                    },
                  })
                    .then(response => response.json())
                    .then(response => {
                      let data = latestData.rawData;
                      let operations = response.objects.length > 0 ? response.objects.map(operation => {
                        return assocPath(['ast'], JSON.parse(operation.ast), operation);
                      }) : response.objects;

                      operations.sort(function(a, b) {
                        return a.sort_order - b.sort_order;
                      });
          
                      try {
                        data = executeOperations(
                          latestData.rawData,
                          dataset,
                          operations,
                        );

                        const isDataDiff = diff(data, JSON.parse(dataset.data));

                        if(Object.entries(isDataDiff).length > 0 && isDataDiff.constructor === Object) {
                          const payload = {
                            data: JSON.stringify(data),
                            chart: {pk: dataset.chart},
                            data_source: {pk: dataset.data_source},
                          };
        
                          console.log('updating data reference for dataset ' + dataset.name);
                          
                          fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dataset/${dataset.id}/`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `ApiKey ${username}:${apiKey}`
                            },
                            body: JSON.stringify(payload)
                          })
                            .then((response) => response.json())
                            .then(response => {
                            })
                            .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
                        } else {
                          Promise.resolve();
                        }
                      
                      } catch (error) {
                        dispatch(addNotification({ message: error.message, type: 'error' }));
                      }
                    })
                    .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
                });

                Promise.all(datasetDataUpdates).then(responses => {
                  console.log('all datasets updated');
                  dispatch(
                    receiveDataSources(
                      dataSourcesToAddToState
                    )
                  );
                  dispatch(setLoader(false));
                });
              })
          })

        } else {
          dispatch(
            receiveDataSources(
              dataSources
            )
          );
          dispatch(setLoader(false));
        }
      })
      .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
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

  const integration_id = getTokenId(provider);

  const payload = {
    name,
    chart: { pk: chartId },
    provider,
    resource,
    params: JSON.stringify(params),
    integration_auth: { pk: integration_id },
  };

  return dispatch => {
    dispatch(setLoader(true));
    return axios.post(
      `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/datasource/`,
      JSON.stringify(payload),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${apiKey}`
        }
      }
    )
    .then(response => {
      dispatch(
        addSource(
          response.data.id,
          response.data.name,
          response.data.chart,
          response.data.provider,
          response.data.resource,
          JSON.parse(response.data.params),
          rawData,
          properties,
        )
      );
      dispatch(setLoader(false));
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