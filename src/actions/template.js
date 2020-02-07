import { setLoader } from './index';
import { addNotification } from './notification';

export const fetchTemplates = (username, apiKey) => {
  return dispatch => {
    dispatch(setLoader(true));
    fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/library/`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${apiKey}`
      },
    })
      .then(response => response.json())
      .then(json => {
        dispatch({
          type: 'RECEIVE_TEMPLATES',
          data: json.objects,
        });
        dispatch(setLoader(false));
      })
      .catch(error => {
        dispatch(addNotification({ message: error.message, type: 'error' }));
        dispatch(setLoader(false));
      });
  }
}