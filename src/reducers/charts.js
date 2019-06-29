import { prepend } from 'ramda';

const charts = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_CHARTS':
      return action.data;
    case 'REMOVE_CHART':
      return state.filter(chart => chart.id !== action.chartId);
    case 'ADD_CHART':
      return prepend(action.data, state);
    default:
      return state;
  }
}
 
export default charts;