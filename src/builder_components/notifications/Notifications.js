import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NOTIFICATION_TYPE = {
  info: toast.TYPE.INFO,
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
  };
};

const Notifications = (props) => {
  const notify = ({ message, type }) => toast(
    message,
    { 
      type: NOTIFICATION_TYPE[type],
    }
  );
  notify(props.notification);
  return null;
}

export default connect(mapStateToProps)(Notifications);