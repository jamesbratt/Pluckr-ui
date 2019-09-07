const notification = (notifications = null, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      const { message, type } = action.data
      return { message, type };
    }
    case 'REMOVE_NOTIFICATION':
      return null;
    default:
      return notifications;
  }
}
 
export default notification;