import { prepend, assocPath } from 'ramda';

const charts = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_CHARTS':
      return action.data;
    case 'ADD_CHART':
      return prepend(action.data, state);

    // NOT IN USE
    case 'MAKE_CHART_ACTIVE':
      return state.map(chart => {
        if (chart.id === action.id) {
          return assocPath(['isActive'], action.isActive, chart);
        }
        return assocPath(['isActive'], false, chart);
      });

    // NOT IN USE 
    case 'UPDATE_CHART_XAXIS':
      return state.map(chart => {
        if (chart.id === action.id) {
          return assocPath(['xaxis'], action.axisType, chart);
        }
        return chart;
      });

    default:
      return state;
  }
}
 
export default charts;