import { prepend } from 'ramda';

const sources = (state = [], action) => {
  switch (action.type) {
    case 'ADD_SOURCE':
      const newSource = {
        chartId: action.chartId,
        resource: action.resource,
        filters: action.filters
      };
      return prepend(newSource, state);

    default:
      return state;
  }
}
 
export default sources;