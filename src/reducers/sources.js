import { prepend } from 'ramda';

const sources = (state = { data: [] }, action) => {
  switch (action.type) {
    case 'RECEIVE_DATA_SOURCES':
      return { data: action.data };
    case 'ADD_SOURCE':
      const newSource = {
        id: action.id,
        name: action.sourceName,
        chart: action.chartId,
        provider: action.provider,
        resource: action.resource,
        params: action.params,
        rawData: action.data,
        properties: action.properties,
      };
      return { data: prepend(newSource, state) };

    default:
      return state;
  }
}
 
export default sources;