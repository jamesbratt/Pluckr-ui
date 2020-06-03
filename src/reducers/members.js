import { append } from 'ramda';

const members = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_MEMBERS':
      return action.data;
    case 'REMOVE_MEMBERS':
      return state.filter(member => member.id !== action.memberId);
    case 'ADD_MEMBERS':
      return append(action.data, state);
    default:
      return state;
  }
}
 
export default members;