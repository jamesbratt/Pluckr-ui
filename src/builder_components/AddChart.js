import React from 'react';
import { createChart } from '../actions/chart';
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

      const user = props.user[0].username;
      const apiKey = props.user[0].api_key;

      props.dispatch(
        createChart(
          apiKey,
          user,
          chartNameRef.current.value,
          chartTypeRef.current.value,
        )
      );
    } else {
      alert('Fill out all required chart fields');
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
        </select>
      </div>
      <button onClick={addNewChart} className="btn btn-success" type="submit">Create Chart</button>
    </form>
  );
}

export default connect(
  mapStateToProps
)(AddChart);