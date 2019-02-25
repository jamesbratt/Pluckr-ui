import { append, merge } from 'ramda';

const operations = (state = [], action) => {
  switch (action.type) {
    case 'ADD_OPERATION':
      const newOperation = {
        id: action.id,
        dataSetId: action.dataSetId,
        rootFunction: action.rootFunction,
        ast: action.ast,
        order: state.length + 1,
      };
      return append(newOperation, state);

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