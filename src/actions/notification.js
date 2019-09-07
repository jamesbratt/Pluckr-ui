export const addNotification = (data) => {
  return {
    type: 'ADD_NOTIFICATION',
    data,
  }
};

export const removeNotification = (id) => {
  return {
    type: 'REMOVE_NOTIFICATION',
    id,
  }
};