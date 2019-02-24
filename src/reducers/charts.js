import { append, assocPath } from 'ramda';

const charts = (state = [], action) => {
  switch (action.type) {
    case 'ADD_CHART':
      const newChart = {
        id: action.id,
        name: action.chartName,
        xaxis: null,
      };
      return append(newChart, state);

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