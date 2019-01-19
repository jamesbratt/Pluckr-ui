import { prepend } from 'ramda';

const sources = (state = [], action) => {
  switch (action.type) {
    case 'ADD_SOURCE':
      const newSource = {
        id: action.id,
        name: action.sourceName,
        chartId: action.chartId,
        resource: action.resource,
        rawData: action.data,
        properties: action.properties,
      };
      return prepend(newSource, state);

    default:
      return state;
  }
}
 
export default sources;