import { prepend } from 'ramda';

const dashboards = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_DASHBOARDS':
      return action.data;
    case 'REMOVE_DASHBOARDS':
      return state.filter(dashboard => dashboard.id !== action.dashboardId);
    case 'ADD_DASHBOARDS':
      return prepend(action.data, state);
    default:
      return state;
  }
}
 
export default dashboards;