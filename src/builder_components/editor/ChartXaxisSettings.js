import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { pathOr } from 'ramda';
import { updateXaxis } from './Graph';
import { updateChart } from '../../actions/chart';
import { connect } from 'react-redux';

const axisTitleRef = React.createRef();
const chartTypeRef = React.createRef();
const axisIsEnabledRef = React.createRef();

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    charts: state.charts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateChart: (apiKey, user, chartId, updates, updateGraph) => {
      dispatch(updateChart(
        apiKey,
        user,
        chartId,
        updates,
        updateGraph,
      ));
    }
  };
};

const ChartXaxisSettings = (props) => {

  const onChange = () => {
    const title = pathOr(null, ['value'], axisTitleRef.current);
    const type = pathOr(null, ['value'], chartTypeRef.current);
    const isEnabled = pathOr(null, ['checked'], axisIsEnabledRef.current);
    const { api_key, username } = props.user;
    props.updateChart(
      api_key,
      username,
      props.chartId,
      [{x_axis_title: title}, {chart_type: type}, {x_axis_enabled: isEnabled}],
      updateXaxis,
    );
  }

  const chart = props.charts.find(chart => chart.id === parseInt(props.chartId))

  return (
    <Row>
      <Col md={4}>
        <div class="form-group form-check">
          <input defaultChecked={chart.x_axis_enabled} onChange={onChange} ref={axisIsEnabledRef} type="checkbox" class="form-check-input" name="axis-display" />
          <label class="form-check-label">Enable X-axis</label>
        </div>
        <div className="form-group">
          <label>Axis Title</label>
          <input defaultValue={chart.x_axis_title} onChange={onChange} ref={axisTitleRef} className="form-control" type="text" placeholder="X-axis title" />
        </div>
        <div class="form-group">
          <label>Chart Type</label>
          <select defaultValue={chart.chart_type} onChange={onChange} ref={chartTypeRef} className="form-control">
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