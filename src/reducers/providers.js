import { append } from 'ramda';

const providers = (state = [], action) => {
  switch (action.type) {
    case 'SETTING_PROVIDERS':
      return action.payload.map((provider) => ({ provider, isEditing: false }));

    case 'CREATE_PROVIDER':
      return append({ provider: action.payload, isEditing: true, swaggerDefinition: action.payload.swagger_definition }, state);
      
    case 'EDIT_PROVIDER':
      return state.map(p => {
        if (p.provider.id === action.payload) {
          return {
            provider: p.provider,
            isEditing: true,
          }
        }

        return p;
      });

    case 'SET_SWAGGER_DEF':
      return state.map(p => {
        if (p.provider.id === action.payload.id) {
          return {
            ...p,
            swaggerDefinition: action.payload.swaggerDef,
          }
        }

        return p;
      });
      
    case 'DELETE_PROVIDER':
      return state.filter(p => p.provider.id !== action.payload);

    default:
      return state;
  }
};

export default providers;