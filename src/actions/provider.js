import axios from "axios";
import { addNotification } from './notification';

export const fetchProviders = () => {
  return (dispatch, getState) => {
    dispatch(setProviderLoader(true));
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
    dispatch(setProviderLoader(true));
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
    dispatch(setProviderLoader(true));
    const user = getState().user[0];
    const { username, api_key } = user;

    return axios.post(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/provider/`,
    JSON.stringify(payload),
    {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${api_key}`
      },
    }).then((response) => {
        dispatch({
          type: 'CREATE_PROVIDER',
          payload: response.data,
        });
        dispatch(addNotification({ message: `${response.data.name} has successfully been created`, type: 'success' }));
      })
      .catch(error => {
        dispatch(addNotification({ message: error.response.data, type: 'error' }))
      });
  }
}

export const updateDataProvider = (id, payload) => {

  return (dispatch, getState) => {
    dispatch(setProviderLoader(true));
    const user = getState().user[0];
    const { username, api_key } = user;

    return axios.put(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/provider/${id}/`,
    JSON.stringify(payload),
    {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${api_key}`
      },
    }).then((response) => {
      dispatch({
        type: 'UPDATE_PROVIDER',
        payload: { data: response.data, id },
      });
      dispatch(addNotification({ message: `${response.data.name} has successfully been updated`, type: 'success' }));
    })
    .catch(error => {
      dispatch(addNotification({ message: error.response.data, type: 'error' }))
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

export const setProviderLoader = (payload) => ({
  type: 'SET_PROVIDER_LOADER',
  payload,
});