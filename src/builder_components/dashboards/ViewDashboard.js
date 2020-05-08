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

    render() {
      const { id } = this.props.match.params;
      const dashboard = this.props.dashboards.find(dashboard => dashboard.id === parseInt(id));
      return (
        <div className="row">
          <div className="col-md-12">
            <div className="table-wrapper">
              <h2>{`Dashboard with ID ${id}`}</h2>
              {dashboard.charts.sort((a, b) => a.order - b.order)
                  .map(chart => <Visualisation config={chart} />)}
            </div>
          </div>
        </div>
      )
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDashboard);