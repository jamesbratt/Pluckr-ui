import { append, assocPath } from 'ramda';

const charts = (state = [], action) => {
  switch (action.type) {
    case 'ADD_CHART':
      const charts = state.map(chart => {
        if (chart.isActive) {
          return assocPath(['isActive'], false, chart);
        }
        return chart;
      })
  
      const newChart = {
        id: action.id,
        name: action.chartName,
        xaxis: action.chartType,
        isActive: true,
      };
      return append(newChart, charts);

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