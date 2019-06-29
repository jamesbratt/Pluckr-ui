import { prepend } from 'ramda';

const sources = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_DATA_SOURCES':
      return action.data;
    case 'ADD_SOURCE':
      const newSource = {
        id: action.id,
        name: action.sourceName,
        chart: action.chartId,
        resource: action.resource,
        params: action.params,
        rawData: action.data,
        properties: action.properties,
      };
      return prepend(newSource, state);

    default:
      return state;
  }
}
 
export default sources;