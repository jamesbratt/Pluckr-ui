import React from 'react';
import { pathOr } from 'ramda';
import { updateXaxis } from './Graph';
import { connect } from 'react-redux';

const axisTitleRef = React.createRef();
const chartTypeRef = React.createRef();
const axisIsEnabledRef = React.createRef();

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const ChartXaxisSettings = (props) => {

  const save = () => {
    const title = pathOr(null, ['value'], axisTitleRef.current);
    const type = pathOr(null, ['value'], chartTypeRef.current);
    const isEnabled = pathOr(null, ['checked'], axisIsEnabledRef.current);
    updateXaxis(title, type, isEnabled);
  }

  return (
    <React.Fragment>
      <div class="form-group form-check">
        <input ref={axisIsEnabledRef} type="checkbox" class="form-check-input" name="axis-display" />
        <label class="form-check-label">Enable X-axis</label>
      </div>
      <div className="form-group">
        <label>Axis Title</label>
        <input ref={axisTitleRef} className="form-control" type="text" placeholder="X-axis title" />
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
      <button className="btn btn-primary my-2 my-sm-0" onClick={save}>Save</button>
    </React.Fragment>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartXaxisSettings);