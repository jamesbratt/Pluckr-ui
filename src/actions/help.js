export const toggleHelp = (topic) => {
  return {
    type: 'TOGGLE_HELP',
    topic
  }
};

export const switchHelpTopic = (topic) => {
  return {
    type: 'SWITCH_TOPIC',
    topic
  }
};