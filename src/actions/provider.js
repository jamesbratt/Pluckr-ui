import axios from "axios";
import { addNotification } from './notification';

export const setDataProviders = (payload) => {
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
    
    return axios(options)
      .then((response) => {
        dispatch({
          type: 'SET_PROVIDERS',
          payload,
        });
      })
      .catch(error => {
        dispatch(addNotification({ message: error, type: 'error' }));
      });
  };
};

export const createDataProvider = (payload) => {
  return (dispatch) => {
    return {
      type: 'CREATE_PROVIDER',
      payload,
    }
  };
};

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