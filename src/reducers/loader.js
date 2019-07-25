const loader = (state = true, action) => {
  switch (action.type) {
    case 'SET_LOADER':
      return action.isLoading;
    default:
      return state;
  }
};

export default loader;