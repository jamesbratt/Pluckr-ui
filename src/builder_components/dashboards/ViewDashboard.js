import React, { Component } from 'react';
import Visualisation from './Visualisation';

import { connect } from 'react-redux';
import { fetchCharts } from '../../actions/chart';
import { createMember, deleteMember, fetchMembers } from '../../actions/members';

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    dashboards: state.dashboards,
    loader: state.loader,
  };
};

const mapDispatchToProps = {
  fetchCharts,
  fetchMembers,
  deleteMember,
  createMember,
};

class ViewDashboard extends Component {

    generateRows(arr, size) {
      if (!Array.isArray(arr)) {
        throw new TypeError('Input should be Array');
      }

      if (typeof size !== 'number') {
        throw new TypeError('Size should be a Number');
      }

      var result = [];
      for (var i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, size + i));
      }

      return result;
    };

    render() {
      const { id } = this.props.match.params;
      const dashboard = this.props.dashboards.find(dashboard => dashboard.id === parseInt(id));
      const charts = dashboard.charts.sort((a, b) => a.order - b.order)
        .map(chart => <Visualisation config={chart} />);

      const rows = this.generateRows(charts, 2);

      return (
        <div className="row">
          <div className="col-md-12">
              <h2>{`Dashboard with ID ${id}`}</h2>
              {rows.map((row) => (
                <div className="row">
                {
                  row.map((col) => (
                    <div className="col-md-6"><div className="table-wrapper">{ col }</div></div>
                  ))
                }
                </div>
              ))}
          </div>
        </div>
      )
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDashboard);