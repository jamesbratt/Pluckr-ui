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

class ViewDashboard extends Component {

    render() {
      return (
        <React.Fragment>
          {`Dashboard with ID ${this.props.match.params.id}`}
        </React.Fragment>
      )
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDashboard);