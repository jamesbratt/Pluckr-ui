import { assocPath, prepend } from 'ramda';

const datasets = (state = [], action) => {
  switch (action.type) {
    case 'ADD_DATASET':
      const datasets = state.map(dataset => {
        if (dataset.isActive) {
          assocPath(['isActive'], false, dataset);
        }
        return dataset;
      })
      const newDataset = {
        id: action.id,
        sourceId: action.sourceId,
        chartId: action.chartId,
        isActive: action.isActive,
        title: action.title,
        rawData: null,
      };
      return prepend(newDataset, datasets);

    case 'RUN_DATASET':
      return state.map(dataset => {
        if (dataset.id === action.datasetId) {
          const updatedData = assocPath(['rawData'], action.rawData, dataset);
          return updatedData;
        }
        return dataset;
      });
  
    default:
      return state;
  }
}
 
export default datasets;