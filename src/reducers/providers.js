import { append } from 'ramda';

const providers = (state = [], action) => {
  switch (action.type) {
    case 'SETTING_PROVIDERS':
      return action.payload.map((provider) => ({ provider, isEditing: false }));

    case 'CREATE_PROVIDER':
      return append({ provider: action.payload, isEditing: true }, state);
      
    case 'EDIT_PROVIDER':
    case 'DELETE_PROVIDER':

    default:
      return state;
  }
};

export default providers;