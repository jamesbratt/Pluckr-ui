import { append, merge } from 'ramda';

const operations = (state = [], action) => {
  switch (action.type) {
    case 'ADD_OPERATION':
      return append(action.data, state);

    case 'RECEIVE_OPERATIONS':
      action.data.sort(function(a, b) {
        return a.sort_order - b.sort_order;
      });
  
      return action.data;

    case 'REMOVE_OPERATION':
      return state.filter(operation => operation.id !== action.operationId);

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