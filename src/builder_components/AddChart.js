import React from 'react';
import { GenerateGuid } from '../utils/Helpers';
import { addChart } from '../actions';
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
      props.dispatch(
        addChart(
          GenerateGuid(),
          chartNameRef.current.value,
          chartTypeRef.current.value,
        )
      );
    } else {
      alert('Fill out all required chart fields');
    }
  } 

  return (
    <form className="form-inline my-2 my-lg-0">
      <input ref={chartNameRef} className="form-control mr-sm-2" type="text" placeholder="What is your chart called?" aria-label="New Chart" />
      <select ref={chartTypeRef} className="form-control mr-sm-2">
        <option value={null}>-- Select a Chart --</option>
        <option value="linear">Linear Line Chart</option>
        <option value="datetime">Time-based Line Chart</option>
        <option value="category">Bar Chart</option>
      </select>
      <button onClick={addNewChart} className="btn btn-outline-success my-2 my-sm-0" type="submit">Create Chart</button>
    </form>
  );
}

export default connect(
  mapStateToProps
)(AddChart);