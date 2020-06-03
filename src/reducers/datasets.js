import { append, merge } from 'ramda';

const datasets = (state = [], action) => {
  switch (action.type) {
    case 'ADD_DATASET': {
      const existing = state.find(dataset => dataset.id === action.data.id);
      if (existing) {
        return state.map(dataset => {
          if (dataset.id === action.data.id) {
            return action.data;
          }
          return dataset;
        })
      } else {
        return append(action.data, state);
      }
    }

    case 'SET_DATASETS':
      return action.payload;

    case 'REMOVE_DATASET':
      return state.filter(dataset => dataset.id !== action.datasetId);

    case 'UPDATE_DATASET_YAXIS':
      return state.map(dataset => {
        if (dataset.id === action.datasetId) {
          const updatedData = merge(
            dataset,
            action.payload,
          );
          return updatedData;
        }
        return dataset;
      });

    case 'UPDATE_DATASET': {
        return state.map(dataset => {
          if (dataset.id === parseInt(action.dataSetId)) {
            return merge(dataset, action.data)
          }
          return dataset;
        })
    }

    case 'RUN_DATASET':
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