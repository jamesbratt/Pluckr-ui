import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { pathOr } from 'ramda';
import { updateChart } from '../../actions/chart';
import { connect } from 'react-redux';

const chartTitleRef = React.createRef();

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    charts: state.charts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateChart: (apiKey, user, chartId, updates) => {
      dispatch(updateChart(
        apiKey,
        user,
        chartId,
        updates,
      ));
    }
  };
};

const ChartSettings = (props) => {

  const onChange = () => {
    const title = pathOr(null, ['value'], chartTitleRef.current);
    const { api_key, username } = props.user;
    props.updateChart(api_key, username, props.chartId, [{name: title}]);
  }

  const chart = props.charts.find(chart => chart.id === parseInt(props.chartId))

  return (
    <Row>
      <Col md={4}>
        <div className="form-group">
          <label>Chart Title</label>
          <input onChange={onChange} defaultValue={chart.name} ref={chartTitleRef} className="form-control" type="text" placeholder="Chart title" />
        </div>
      </Col>
    </Row>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartSettings);