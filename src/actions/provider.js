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

export const fetchProvider = (id) => {
  return (dispatch, getState) => {
    const user = getState().user[0];
    const { username, api_key } = user;

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${username}:${api_key}`
      },
      url: `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/provider/${id}`,
    };
    
    axios(options)
      .then((response) => dispatch({
        type: 'SET_SWAGGER_DEF',
        payload: { id: response.data.id, swaggerDef: response.data.swagger_definition },
      }))
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

export const deleteProvider = (id) => {

  return (dispatch, getState) => {
    const user = getState().user[0];
    const { username, api_key } = user;

    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${username}:${api_key}`
      },
      url: `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/provider/${id}/`,
    };
    return axios(options)
      .then(() => {
        dispatch(deleteDataProvider(id))
      })
      .catch(error => dispatch(addNotification({ message: error, type: 'error' })));
  }
}

export const setProviders = (payload) => ({
  type: 'SETTING_PROVIDERS',
  payload,
});

export const editDataProvider = (payload) => ({
  type: 'EDIT_PROVIDER',
  payload,
});

export const deleteDataProvider = (payload) => ({
  type: 'DELETE_PROVIDER',
  payload,
});