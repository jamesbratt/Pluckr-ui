import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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

  const onChange = () => {
    const title = pathOr(null, ['value'], axisTitleRef.current);
    const type = pathOr(null, ['value'], chartTypeRef.current);
    const isEnabled = pathOr(null, ['checked'], axisIsEnabledRef.current);
    updateXaxis(title, type, isEnabled);
  }

  return (
    <Row>
      <Col md={4}>
        <div class="form-group form-check">
          <input onChange={onChange} ref={axisIsEnabledRef} type="checkbox" class="form-check-input" name="axis-display" />
          <label class="form-check-label">Enable X-axis</label>
        </div>
        <div className="form-group">
          <label>Axis Title</label>
          <input onChange={onChange} ref={axisTitleRef} className="form-control" type="text" placeholder="X-axis title" />
        </div>
        <div class="form-group">
          <label>Chart Type</label>
          <select onChange={onChange} ref={chartTypeRef} className="form-control">
            <option value={null}>-- Select a Chart --</option>
            <option value="linear">Linear Line Chart</option>
            <option value="datetime">Time-based Line Chart</option>
            <option value="category">Bar Chart</option>
          </select>
        </div>
      </Col>
    </Row>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartXaxisSettings);