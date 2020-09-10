const help = (state = { isOpen: false, topic: null }, action) => {
  switch (action.type) {
    case 'TOGGLE_HELP':
      return !state.isOpen ? { isOpen: true, topic: action.topic } : { isOpen: false, topic: null };
    case 'SWITCH_TOPIC':
      return { isOpen: true, topic: action.topic };
    default:
      return state;
  }
};

export default help;