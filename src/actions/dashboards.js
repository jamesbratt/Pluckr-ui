import { updateChartInstance } from '../builder_components/editor/Graph';
import { setLoader } from './index';
import { addNotification } from './notification';

import axios from "axios";

export const addDashboard = (data) => {
  return {
    type: 'ADD_DASHBOARDS',
    data,
  }
};

export const removeDashboard = (dashboardId) => {
  return {
    type: 'REMOVE_DASHBOARDS',
    dashboardId,
  }
};

export const receiveDashboards = (data) => {
  return {
    type: 'RECEIVE_DASHBOARDS',
    data
  }
};

export const fetchDashboards = (apiKey, username) => {

  return dispatch => {
    dispatch(setLoader(true));

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${username}:${apiKey}`
      },
      url: `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dashboard/`,
    };
    return axios(options)
      .then((response) => {
        dispatch(setLoader(false));
        dispatch(receiveDashboards(response.data.objects));
      })
      .catch(error => {
        dispatch(setLoader(false));
        dispatch(addNotification({ message: error, type: 'error' }));
      });
  }
}

export const createDashboard = (apiKey, username, name) => {

  const payload = {
    name,
  };

  return dispatch => {

    return axios.post(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dashboard/`,
    JSON.stringify(payload),
    {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${apiKey}`
      },
    }).then((response) => {
        dispatch(addDashboard(response.data))
      })
      .catch(error => dispatch(addNotification({ message: error, type: 'error' })));
  }
}

export const deleteDashboard = (apiKey, username, dashboardId) => {

  return dispatch => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${username}:${apiKey}`
      },
      url: `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dashboard/${dashboardId}/`,
    };
    return axios(options)
      .then(() => {
        dispatch(removeDashboard(dashboardId))
      })
      .catch(error => dispatch(addNotification({ message: error, type: 'error' })));
  }
}
