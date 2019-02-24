import React from 'react';
import { connect } from 'react-redux';
import { updateChartXaxis } from '../actions';

const ChartConfiguration = (props) => {

  const updateAxis = (event) => {
    const xAxisType = event.target.value;
    props.dispatch(
      updateChartXaxis(props.chartId, xAxisType),
    )
    props.updateChart(xAxisType);
  }

  return (
    <div className="row">
      <div className="col-md-12 grey-panel">
        <form>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Select X axis Type</label>
                <select className="form-control" onChange={updateAxis}>
                  <option value={null} hidden>-- Select an X axis type --</option>
                  <option value="linear">Linear</option>
                  <option value="datetime">Datetime</option>
                  <option value="category">Category</option>
                  <option value="logarithmic">Logarithmic</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return state
};

export default connect(mapStateToProps)(ChartConfiguration);