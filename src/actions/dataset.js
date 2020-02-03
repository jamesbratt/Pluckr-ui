import { clone } from 'ramda';
import { updateYaxis, updateDataSeries } from '../builder_components/editor/Graph';
import { executeOperations } from '../data_parsing/parse';
import { addNotification } from './notification';

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

  return (dispatch) => {

    const payload = Object.assign({}, ...updates);

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
        updateDataSeries(dataSetId, Object.assign({}, ...updates));
        dispatch({
          type: 'UPDATE_DATASET',
          dataSetId,
          data: response
        });
      })
      .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
  }
}

export const createDataSet = (
  apiKey,
  username,
  name,
  chartId,
  sources,
  data,
) => {

  const payload = {
    name,
    chart: `/api/v1/chart/${chartId}/`,
    sources,
    y_axis_id: null,
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
      json['data'] = data;
      dispatch(
        addDataset(
          json,
        )
      );
      return Promise.resolve(json);
    })
    .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
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
    .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
  }
}

export const updateDatasetYaxis = (
  apiKey,
  username,
  dataSetId,
  title,
  isOpposite,
  isEnabled,
  dataset
) => {

  return (dispatch) => {

    const payload = {
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
        updateYaxis(dataSetId, title, isOpposite, isEnabled, dataset.chart);

        dispatch(patchDataset(
          dataSetId,
          response,
        ))
      })
      .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
  }
};

export const runDataSet = (
  dataSetId,
  callback,
  seriesType,
) => {

  return (dispatch, getState) => {

    const { datasets, operations, sources } = getState();

    let data = [];
    const currentDataSet = datasets.find(dataset => dataset.id === dataSetId);
    const currentOperations = operations.filter(operation => operation.dataset.id === dataSetId);

    const rawData = currentDataSet.sources.length === 1 ?
      sources.data.find(
        source => source.id === currentDataSet.sources[0].id,
      ).rawData :
      currentDataSet.sources.reduce((acc, curr) => {
        const data = sources.data.find(
          source => source.id === curr.id,
        ).rawData;
        acc.push(data);
        return acc;
      }, []);

    // Having to clone the source data here as for some reason
    // the highcharts api is mutating the raw data in the sources store
    const clonedData = clone(rawData);

    try {
      data = executeOperations(
        clonedData,
        currentDataSet,
        currentOperations,
      );

      dispatch({
        type: 'RUN_DATASET',
        datasetId: dataSetId,
        rawData: data
      })

      callback(
        currentDataSet.id,
        currentDataSet.name,
        data,
        seriesType,
        currentDataSet,
      );

    } catch (error) {
      dispatch(addNotification({ message: error.message, type: 'error' }));
    }
  }
}