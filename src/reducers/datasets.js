import { prepend } from 'ramda';

const datasets = (state = [], action) => {
  switch (action.type) {
    case 'ADD_DATASET':
      const newDataset = {
        id: action.id,
        sourceId: action.sourceId,
        chartId: action.chartId,
        property: action.property,
        data: action.data,
      };
      return prepend(newDataset, state);

    default:
      return state;
  }
}
 
export default datasets;