import { append } from 'ramda';

const providers = (state = { providers: [], isLoading: true }, action) => {
  switch (action.type) {
    case 'SETTING_PROVIDERS':
      return {
        isLoading: false,
        providers: action.payload.map((provider) => ({ ...provider, isEditing: false }))
      }

    case 'CREATE_PROVIDER': {
      const newProvider = action.payload;
      return {
        isLoading: false,
        providers: append({ ...newProvider, isEditing: true }, state.providers)
      }
    }

    case 'UPDATE_PROVIDER':
      return {
        isLoading: false,
        providers: state.providers.map(p => {
          if (p.id === action.payload.id) {
            return action.payload.data
          }
          return p;
        })
      }

    case 'EDIT_PROVIDER':
      return {
        ...state,
        providers: state.providers.map(p => {
          if (p.id === action.payload) {
            return {
              ...p,
              isEditing: true,
            }
          }
          return p;
        })
      }

    case 'SET_PROVIDER_LOADER':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'DELETE_PROVIDER':
      return {
        ...state,
        providers: state.providers.filter(p => p.id !== action.payload),
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default providers;