import { prepend } from 'ramda';

const sources = (state = { data: [] }, action) => {
  switch (action.type) {
    case 'RECEIVE_DATA_SOURCES':
      return { data: action.data };
    case 'RECEIVE_SINGLE_DATA_SOURCE': {
      const { id } = action.data;
      const exists = state.data.find(source => source.id === id);
      if (!exists) {
        return { data: prepend(action.data, state.data) };
      } else {
        return { data: state.data.map((source) => {
          if (source.id === id) {
            return action.data;
          }
          return source;
        }) };
      }
    }
    case 'DELETE_DATA_SOURCE':
      return { data: state.data.filter(datasource => datasource.id !== parseInt(action.datasourceId)) };
    case 'ADD_SOURCE':
      const newSource = {
        id: action.id,
        name: action.sourceName,
        chart: action.chartId,
        provider: action.provider,
        resource: action.resource,
        params: action.params,
        rawData: action.data,
        data_provider_id: action.data_provider_id,
      };
      return { data: prepend(newSource, state.data) };
    case 'UPDATE_SOURCE':
      const existingSource = {
        id: action.id,
        name: action.sourceName,
        chart: action.chartId,
        provider: action.provider,
        resource: action.resource,
        params: action.params,
        rawData: action.data,
        data_provider_id: action.data_provider_id,
      };

      const updatedSources = state.data.map((source) => {
        if (source.id === action.id) {
          return existingSource;
        }
        return source;
      })
      return { data: updatedSources };

    default:
      return state;
  }
}
 
export default sources;