import { append } from 'ramda';

const charts = (state = [], action) => {
  switch (action.type) {
    case 'ADD_CHART':
      const newChart = {
        id: action.id,
        type: action.chartType,
      };
      return append(newChart, state);

    case 'REMOVE_CHART':
      return state;

    default:
      return state;
  }
}
 
export default charts;