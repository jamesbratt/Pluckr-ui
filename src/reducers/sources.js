import { assocPath, prepend } from 'ramda';

const sources = (state = { data: [], active: null, }, action) => {
  switch (action.type) {
    case 'RECEIVE_DATA_SOURCES':
      return { data: action.data, active: null};
    case 'SET_ACTIVE_SOURCE':
      return assocPath(['active'], action.sourceId, state);
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
      return { data: prepend(newSource, state), active: action.id };

    default:
      return state;
  }
}
 
export default sources;