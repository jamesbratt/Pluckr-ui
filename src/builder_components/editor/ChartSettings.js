import React from 'react';
import { pathOr } from 'ramda';
import { updateChart } from '../../actions/chart';
import { updateXaxis } from './Graph';
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

  const save = () => {
    const title = pathOr(null, ['value'], chartTitleRef.current);
    const { api_key, username } = props.user;
    props.updateChart(api_key, username, props.chartId, [{name: title}]);
  }

  const chart = props.charts.find(chart => chart.id === parseInt(props.chartId))

  return (
    <React.Fragment>
      <div className="form-group">
        <label>Chart Title</label>
        <input defaultValue={chart.name} ref={chartTitleRef} className="form-control" type="text" placeholder="Chart title" />
      </div>
      <button className="btn btn-primary my-2 my-sm-0" onClick={save}>Save</button>
    </React.Fragment>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartSettings);