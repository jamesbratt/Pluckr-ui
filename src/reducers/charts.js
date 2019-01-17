import { prepend } from 'ramda';

const charts = (state = [], action) => {
  switch (action.type) {
    case 'ADD_CHART':
      const newChart = {
        id: action.id,
      };
      return prepend(newChart, state);

    case 'REMOVE_CHART':
      return state;

    default:
      return state;
  }
}
 
export default charts;