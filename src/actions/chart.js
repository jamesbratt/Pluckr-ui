import { updateChartInstance } from '../builder_components/editor/Graph';
import { setLoader } from './index';
import { addNotification } from './notification';

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
      .then(json => {
        dispatch(receiveCharts(json.objects));
        dispatch(setLoader(false));
      })
      .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
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
    .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
  }
}

export const updateChart = (
  apiKey,
  username,
  chartId,
  updates,
  graphUpdate = null,
) => {

  return (dispatch) => {

    const payload = Object.assign({}, ...updates);
    
    return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/chart/${chartId}/`, {
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
        graphUpdate ? graphUpdate(payload) : updateChartInstance(payload);
        dispatch({
          type: 'UPDATE_CHART',
          chartId,
          data: response
        });
      })
      .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
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
    .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
  }
}