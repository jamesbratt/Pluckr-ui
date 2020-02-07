const templates = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_TEMPLATES':
      return action.data;
    case 'REMOVE_CHART':
      return state.filter(chart => chart.id !== action.chartId);
    default:
      return state;
  }
}
 
export default templates;