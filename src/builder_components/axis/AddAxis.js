import React from 'react';
import { connect } from 'react-redux';

const axisTitleRef = React.createRef();
const axisDisplayRef = React.createRef();

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
  };
};

const AddAxis = (props) => {

  const create = () => {
    props.add(axisTitleRef.current.value, axisDisplayRef.current.checked);
  }

  return (
    <React.Fragment>
      <div className="form-group">
        <label>Axis Title</label>
        <input ref={axisTitleRef} className="form-control" type="text" placeholder="Y-axis title" />
      </div>
      <div class="form-group form-check">
        <input ref={axisDisplayRef} type="checkbox" class="form-check-input" name="axis-display" />
        <label class="form-check-label">Display to right of chart</label>
      </div>
      <button className="btn btn-primary my-2 my-sm-0" onClick={create}>Create Y-axis</button>
    </React.Fragment>
  );
}

export default connect(
  mapStateToProps,
)(AddAxis);