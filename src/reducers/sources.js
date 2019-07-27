import { merge, prepend } from 'ramda';

const sources = (state = { data: [], active: null, view:'SOURCE_LIST_VIEW' }, action) => {
  switch (action.type) {
    case 'RECEIVE_DATA_SOURCES':
      return merge(state, { data: action.data });
    case 'SWITCH_SOURCE_VIEW':
      return merge(state, { view: action.view, active: action.sourceId });
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
      return { data: prepend(newSource, state), active: action.id, view:'SOURCE_EDIT_VIEW' };

    default:
      return state;
  }
}
 
export default sources;