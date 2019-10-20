import React from 'react';
import { addNotification } from '../actions/notification';
import { connect } from 'react-redux';

const chartNameRef = React.createRef();
const chartTypeRef = React.createRef();

const mapStateToProps = state => {
  return state
};

const AddChart = (props) => {

  const addNewChart = (event) => {
    event.preventDefault();
    if(chartNameRef.current.value && chartTypeRef.current.value) {
      props.add(chartNameRef.current.value, chartTypeRef.current.value);
    } else {
      props.dispatch(addNotification({ message: 'Fill out all required chart fields', type: 'error' }));
    }
  } 

  return (
    <form>
      <div className="form-group">
        <label>Chart Name</label>
        <input ref={chartNameRef} className="form-control" type="text" placeholder="What is your chart called?" aria-label="New Chart" />
      </div>
      <div class="form-group">
        <label>Chart Type</label>
        <select ref={chartTypeRef} className="form-control">
          <option value={null}>-- Select a Chart --</option>
          <option value="linear">Linear Line Chart</option>
          <option value="datetime">Time-based Line Chart</option>
          <option value="category">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      <button onClick={addNewChart} className="btn btn-success" type="submit">Create Chart</button>
    </form>
  );
}

export default connect(
  mapStateToProps
)(AddChart);