import React from 'react';
import { GenerateGuid } from '../utils/Helpers';
import { addChart } from '../actions';
import { connect } from 'react-redux';

const chartNameRef = React.createRef();

const mapStateToProps = state => {
  return state
};

const AddChart = (props) => {

  const addNewChart = (event) => {
    event.preventDefault();
    if(chartNameRef.current.value) {
      props.dispatch(
        addChart(
          GenerateGuid(),
          chartNameRef.current.value
        )
      );
    } else {
      alert('Fill out all required chart fields');
    }
  } 

  return (
    <form className="form-inline my-2 my-lg-0">
      <input ref={chartNameRef} className="form-control mr-sm-2" type="text" placeholder="Create a new chart" aria-label="New Chart" />
      <button onClick={addNewChart} className="btn btn-outline-success my-2 my-sm-0" type="submit">Create Chart</button>
    </form>
  );
}

export default connect(
  mapStateToProps
)(AddChart);