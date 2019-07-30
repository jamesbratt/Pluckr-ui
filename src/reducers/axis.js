import { prepend } from 'ramda';

const axis = (axis = [], action) => {
  switch (action.type) {
    case 'SET_AXIS':
      return action.payload;
    case 'REMOVE_AXIS':
      return axis.filter(a => a.id !== action.id);
    case 'ADD_AXIS':
      return prepend(action.payload, axis);
    default:
      return axis;
  }
}
 
export default axis;