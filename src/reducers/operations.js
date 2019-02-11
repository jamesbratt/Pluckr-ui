import { append } from 'ramda';

const operations = (state = [], action) => {
  switch (action.type) {
    case 'ADD_OPERATION':
      const newOperation = {
        id: action.id,
        dataSetId: action.dataSetId,
      };
      return append(newOperation, state);

    default:
      return state;
  }
}
 
export default operations;