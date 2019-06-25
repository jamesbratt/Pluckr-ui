import { append, assocPath, merge } from 'ramda';

const operations = (state = [], action) => {
  switch (action.type) {
    case 'ADD_OPERATION':
      const newOperation = assocPath(['dataset'], parseInt(action.data.dataset.replace('/api/v1/dataset/', '').replace('/', '')), action.data);
      return append(newOperation, state);

    case 'RECEIVE_OPERATIONS':
      const operations = action.data.map(operation => {
        return assocPath(['dataset'], parseInt(operation.dataset.replace('/api/v1/dataset/', '').replace('/', '')), operation);
      });
      return operations;

    case 'UPDATE_OPERATION':
      const updates = {
        rootFunction: action.rootFunction,
        ast: action.ast,
      };

      return state.map(operation => {
        if (operation.id === action.id) {
          return merge(operation, updates)
        }
        return operation;
      });

    default:
      return state;
  }
}
 
export default operations;