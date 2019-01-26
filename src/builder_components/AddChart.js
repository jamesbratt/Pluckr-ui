import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
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
    <Form inline>
      <FormControl ref={chartNameRef} type="text" placeholder="Create a new chart" className="mr-sm-2" />
      <Button onClick={addNewChart} variant="outline-success">Create Chart</Button>
    </Form>
  );
}

export default connect(
  mapStateToProps
)(AddChart);