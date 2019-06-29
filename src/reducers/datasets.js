import { append, merge } from 'ramda';

const datasets = (state = [], action) => {
  switch (action.type) {
    case 'ADD_DATASET':
      return append(action.data, state);

    case 'RECEIVE_DATASETS':
      return action.data;

    case 'REMOVE_DATASET':
      return state.filter(dataset => dataset.id !== action.datasetId);

    case 'UPDATE_DATASET':
      return state.map(dataset => {
        if (dataset.id === action.datasetId) {
          const updatedData = merge(
            dataset,
            { 'data': action.rawData, },
          );
          return updatedData;
        }
        return dataset;
      });
  
    default:
      return state;
  }
}
 
export default datasets;