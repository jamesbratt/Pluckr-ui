import React from 'react';
import { addNotification } from '../../actions/notification';
import { connect } from 'react-redux';

const dashboardNameRef = React.createRef();

const mapStateToProps = state => {
  return state
};

const AddDashboard = (props) => {

  const addNewDashboard = (event) => {
    event.preventDefault();
    if(dashboardNameRef.current.value) {
      props.add(dashboardNameRef.current.value);
    } else {
      props.dispatch(addNotification({ message: 'Fill out all required fields', type: 'error' }));
    }
  }

  return (
    <form>
      <div className="form-group">
        <label>Dashboard Name</label>
        <input ref={dashboardNameRef} className="form-control" type="text" placeholder="What is your dashboard called?" aria-label="New Dashboard" />
      </div>
      <button onClick={addNewDashboard} className="btn btn-success" type="submit">Create Dashboard</button>
    </form>
  );
}

export default connect(
  mapStateToProps
)(AddDashboard);