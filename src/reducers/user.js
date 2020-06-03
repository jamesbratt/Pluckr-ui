import AsyncTasks from '../utils/AsyncTasks';

const storedUser = localStorage.getItem('pluckr_token');

const initialState = storedUser ? [JSON.parse(storedUser)] : [];

if (storedUser) {
  AsyncTasks(JSON.parse(storedUser).username, JSON.parse(storedUser).api_key);
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'RECEIVE_USER':
      return [action.userData];
    default:
      return state;
  }
};

export default user;