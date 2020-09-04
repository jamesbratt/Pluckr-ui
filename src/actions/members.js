import { setLoader } from './index';
import { addNotification } from './notification';
import { fetchDashboards } from './dashboards';

import axios from "axios";

export const addMember = (data) => {
  return {
    type: 'ADD_MEMBERS',
    data,
  }
};

export const removeMember = (memberId) => {
  return {
    type: 'REMOVE_MEMBERS',
    memberId,
  }
};

export const receiveMember = (data) => {
  return {
    type: 'RECEIVE_MEMBERS',
    data
  }
};

export const updateMember = (data) => {
  return {
    type: 'UPDATE_MEMBERS',
    data
  }
};

export const fetchMembers = (apiKey, username, dashboardId) => {

  return dispatch => {
    dispatch(setLoader(true));

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${username}:${apiKey}`
      },
      url: `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/members/?dashboard=${dashboardId}`,
    };
    return axios(options)
      .then((response) => {
        dispatch(setLoader(false));
        dispatch(receiveMember(response.data.objects));
      })
      .catch(error => {
        dispatch(setLoader(false));
        dispatch(addNotification({ message: error, type: 'error' }));
      });
  }
}

export const createMember = (apiKey, username, dashboardId, chartId, order) => {

  const payload = { dashboard: { pk: dashboardId }, chart: { pk: chartId }, order }

  return dispatch => {

    axios.post(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/members/`,
    JSON.stringify(payload),
    {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${apiKey}`
      },
    }).then((response) => {
        dispatch(addMember(response.data));
        dispatch(fetchDashboards(apiKey, username));
      })
      .catch(error => dispatch(addNotification({ message: error, type: 'error' })));
  }
}

export const updateMembers = (apiKey, username, payload) => {

  const formatPayload = payload.map(p => ({ ...p, chart: { pk: p.chart.id } }));

  return dispatch => {

    axios.patch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/members/`,
    JSON.stringify({ objects: formatPayload }),
    {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${apiKey}`
      },
    }).then((response) => {
        dispatch(receiveMember(response.data.objects));
      })
      .catch(error => dispatch(addNotification({ message: error, type: 'error' })));
  }
}

export const deleteMember = (apiKey, username, memberId) => {

  return dispatch => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${username}:${apiKey}`
      },
      url: `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/members/${memberId}/`,
    };
    return axios(options)
      .then(() => {
        dispatch(removeMember(memberId));
        dispatch(fetchDashboards(apiKey, username));
      })
      .catch(error => dispatch(addNotification({ message: error, type: 'error' })));
  }
}