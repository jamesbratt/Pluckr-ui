import React, { Component } from 'react';
import Loader from '../../Loader';

import { connect } from 'react-redux';
import { fetchCharts } from '../../actions/chart';
import { createMember, deleteMember, fetchMembers } from '../../actions/members';
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    charts: state.charts,
    dashboards: state.dashboards,
    members: state.members,
    loader: state.loader,
  };
};

const mapDispatchToProps = {
  fetchCharts,
  fetchMembers,
  deleteMember,
  createMember,
};

class EditDashboard extends Component {

    componentDidMount() {
      const user = this.props.user.username;
      const apiKey = this.props.user.api_key;
      const dashboardId = this.props.match.params.id;

      this.props.fetchCharts(
        apiKey,
        user,
      );

      this.props.fetchMembers(
        apiKey,
        user,
        dashboardId,
      );
    }

    addMemberToDashboard = (chartId) => {
      const user = this.props.user.username;
      const apiKey = this.props.user.api_key;
      const dashboardId = this.props.match.params.id;
      const order = this.props.members.length;

      this.props.createMember(
        apiKey,
        user,
        parseInt(dashboardId),
        parseInt(chartId),
        order,
      )
    }

    deleteMember = (memberId) => {
      const user = this.props.user.username;
      const apiKey = this.props.user.api_key;

      this.props.deleteMember(
        apiKey,
        user,
        memberId,
      )
    }

    checkIsMember = (chartid) => {
      const match = this.props.members.find(member => member.chart.id === chartid);
      return match ? match.chart.id : null;
    }

    render() {
      const { charts, members } = this.props;
      const { id } = this.props.match.params;
      const dashboard = this.props.dashboards.find(dashboard => dashboard.id === parseInt(id));

      const availableCharts = charts.filter(chart => chart.id !== this.checkIsMember(chart.id)).map(chart => {
        return <li key={chart.id} className="list-group-item">
          {chart.name}
          <div key={chart.id} className="operation-actions float-right">
            <button onClick={() => this.addMemberToDashboard(chart.id)} style={{ marginLeft: '1em' }} className="btn btn-sm btn-link table-btn"><i className="fa fa-plus" /></button>
          </div>
        </li>
    })

      let content = (
        <div className="table-wrapper">
          <div className="row">
            <div className="col-md-6">
              <h5>Add charts to your dashboard</h5>
              {availableCharts.length > 0 ? availableCharts : <p>You have no charts available</p>}
            </div>
            <div className="col-md-6">
              <h5>Charts added to your dashboard</h5>
              {charts.length === 0 || members.length === 0 ? <p>Try adding some charts</p> : members.map(member => {
                  const chartId = member.chart.id;
                  const chartName = charts.find(chart => chart.id === parseInt(chartId)).name;
                  return <li key={member.id} className="list-group-item">
                    {chartName}
                    <div key={member.id} className="operation-actions float-right">
                      <button onClick={() => this.deleteMember(member.id)} style={{ marginLeft: '1em' }} className="btn btn-sm btn-link table-btn"><i className="fa fa-trash" /></button>
                    </div>
                  </li>
              })}
            </div>
          </div>
          <Link to={`/dashboards/${id}/view`}>View Dashboard</Link>
        </div>
      );

      if(this.props.loader) {
        content = <Loader />;
      };

      return (
        <React.Fragment>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><Link to={`/dashboards`}>Back to Dashboards</Link></li>
              <li class="breadcrumb-item active" aria-current="page">{dashboard ? dashboard.name : '...'}</li>
            </ol>
          </nav>
          {content}
        </React.Fragment>
      )
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDashboard);