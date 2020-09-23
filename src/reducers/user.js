import Cookies from 'js-cookie';

const storedUser = Cookies.get('pluckr_token');
const initialState = storedUser ? [JSON.parse(storedUser)] : [];

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'RECEIVE_USER':
      return [action.userData];
    default:
      return state;
  }
};

export default user;