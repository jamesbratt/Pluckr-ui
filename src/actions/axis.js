import { addYaxis } from '../builder_components/editor/Graph';
import { GenerateGuid } from '../utils/Helpers';

export const setAxis = (payload) => {
  return {
    type: 'SET_AXIS',
    payload,
  }
};

export const addAxis = (payload) => {
  return {
    type: 'ADD_AXIS',
    payload,
  }
};

export const removeAxis = (id) => {
  return {
    type: 'REMOVE_AXIS',
    id,
  }
};

export const fetchAxis = () => {
  return dispatch => {
    dispatch(setAxis())
  }
}

export const createAxis = (apiKey, username, title, opposite) => {
  return dispatch => {
    const axis = {
      title: {
          text: title,
      },
      opposite,
      id: GenerateGuid(),
    };
    addYaxis(axis);
    dispatch(addAxis(axis));
  }
}