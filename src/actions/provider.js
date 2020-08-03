import axios from "axios";
import { addNotification } from './notification';

export const fetchProviders = () => {
  return (dispatch, getState) => {
    const user = getState().user[0];
    const { username, api_key } = user;

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${username}:${api_key}`
      },
      url: `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/provider/`,
    };
    
    axios(options)
      .then((response) => dispatch(setProviders(response.data.objects)))
      .catch(error => {
        dispatch(addNotification({ message: error, type: 'error' }));
      });
  };
};

export const createDataProvider = (name, swagger_url) => {

  const payload = {
    name,
    swagger_url,
  };

  return (dispatch, getState) => {
    const user = getState().user[0];
    const { username, api_key } = user;

    return axios.post(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/provider/`,
    JSON.stringify(payload),
    {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${api_key}`
      },
    }).then((response) => (dispatch({
        type: 'CREATE_PROVIDER',
        payload: response.data,
      })))
      .catch(error => {
        dispatch(addNotification({ message: error, type: 'error' }))
      });
  }
}

export const setProviders = (payload) => ({
  type: 'SETTING_PROVIDERS',
  payload,
});

export const editDataProvider = (payload) => {
  return (dispatch) => {
    return {
      type: 'EDIT_PROVIDER',
      payload,
    }
  };
};

export const deleteDataProvider = (payload) => {
  return (dispatch) => {
    return {
      type: 'DELETE_PROVIDER',
      payload,
    }
  };
};