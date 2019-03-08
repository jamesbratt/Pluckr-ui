import { append, assocPath, merge, prepend } from 'ramda';

const datasets = (state = [], action) => {
  switch (action.type) {
    case 'ADD_DATASET':
      const datasets = state.map(dataset => {
        if (dataset.isActive) {
          return assocPath(['isActive'], false, dataset);
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
        hasYaxis: true,
      };
      return append(newDataset, datasets);

    case 'MAKE_DATASET_ACTIVE':
      return state.map(dataset => {
        if (dataset.id === action.id) {
          return assocPath(['isActive'], action.isActive, dataset);
        }
        return assocPath(['isActive'], false, dataset);
      });

    case 'RUN_DATASET':
      return state.map(dataset => {
        if (dataset.id === action.datasetId) {
          const updatedData = merge(
            dataset,
            {
              'rawData': action.rawData,
              'hasYaxis': action.hasYaxis
            }
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