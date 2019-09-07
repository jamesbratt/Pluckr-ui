import { assocPath, clone } from 'ramda';
import { updateYaxis, updateDataSeries } from '../builder_components/editor/Graph';
import { executeOperations } from '../data_parsing/parse';
import { addNotification } from './notification';

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

export const patchDataset = (datasetId, payload) => {
  return {
    type: 'UPDATE_DATASET_YAXIS',
    datasetId,
    payload
  }
}

export const updateDataSet = (
  apiKey,
  username,
  dataSetId,
  updates
) => {

  return (dispatch, getState) => {

    const { datasets } = getState();
    const currentDataSet = datasets.find(dataset => dataset.id === dataSetId);

    const payload = Object.assign({}, ...updates);
    payload['chart'] = {pk: currentDataSet.chart};
    payload['data_source'] = {pk: currentDataSet.data_source};
    
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
      .then(response => {
        response['data'] = JSON.parse(response.data);
        updateDataSeries(dataSetId, Object.assign({}, ...updates));
        dispatch({
          type: 'UPDATE_DATASET',
          dataSetId,
          data: response
        });
      })
      .catch(error => alert(error));
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
          if (dataset.data) {
            return assocPath(['data'], JSON.parse(dataset.data), dataset);
          }
          return dataset;
        });
        dispatch(receiveDatasets(datasets));
        dispatch(addNotification({ message: 'Datasets received', type: 'info' }));
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
      json['data'] = json.data ? JSON.parse(json.data) : json.data;
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

export const updateDatasetYaxis = (
  apiKey,
  username,
  dataSetId,
  title,
  isOpposite,
  isEnabled,
) => {

  return (dispatch, getState) => {

    const { datasets } = getState();
    const currentDataSet = datasets.find(dataset => dataset.id === dataSetId);

    const payload = {
      chart: {pk: currentDataSet.chart},
      data_source: {pk: currentDataSet.data_source},
      y_axis_title: title,
      y_axis_is_opposite: isOpposite,
      y_axis_enabled: isEnabled,
    };

    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dataset/${dataSetId}/`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${apiKey}`
      },
      body: JSON.stringify(payload)
    })
      .then((response) => response.json())
      .then(response => {
        response['data'] = JSON.parse(response.data);
        updateYaxis(dataSetId, title, isOpposite, isEnabled);
  
        dispatch(patchDataset(
          dataSetId,
          response,
        ))
      })
      .catch(error => alert(error));
  }
};

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

    const currentDataSource = sources.data.find(
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
        dispatch({
          type: 'RUN_DATASET',
          datasetId: dataSetId,
          rawData: json.data
        })

        callback(
          currentDataSet.id,
          currentDataSet.name,
          data,
          seriesType,
          currentDataSet,
        );
      })
      .catch(error => alert(error));
  }
}