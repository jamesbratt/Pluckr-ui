import { append, assocPath, merge } from 'ramda';

const datasets = (state = [], action) => {
  switch (action.type) {
    case 'ADD_DATASET':
      return append(action.data, state);

    case 'RECEIVE_DATASETS':
      return action.data;

    case 'MAKE_DATASET_ACTIVE':
      return state.map(dataset => {
        if (dataset.id === action.id) {
          return assocPath(['isActive'], action.isActive, dataset);
        }
        return assocPath(['isActive'], false, dataset);
      });

    case 'UPDATE_DATASET_YAXIS':
      return state.map(dataset => {
        if (dataset.id === action.id) {
          return assocPath(['yaxis'], action.yaxisId, dataset);
        }
        return dataset;
      });

    case 'RUN_DATASET':
      return state.map(dataset => {
        if (dataset.id === action.datasetId) {
          const updatedData = merge(
            dataset,
            { 'rawData': action.rawData, },
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