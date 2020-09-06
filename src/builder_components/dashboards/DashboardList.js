import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import AddDashboard from './AddDashboard';
import DataProviderTable from '../dataproviders/DataProviderTable';
import Loader from '../../Loader';
import sadFace from '../../img/sad-face.png';

import { connect } from 'react-redux';
import { createDashboard, fetchDashboards, deleteDashboard } from '../../actions/dashboards';
import { Link, Redirect } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    dashboards: state.dashboards,
    loader: state.loader,
  };
};

const mapDispatchToProps = {
  createDashboard,
  deleteDashboard,
  fetchDashboards,
};

class DashboardList extends Component {
    constructor(props) {
      super(props);
      this.state = {
        showModal: false,
        hasCreated: null,
      }
    }

    componentDidMount() {
      const user = this.props.user.username;
      const apiKey = this.props.user.api_key;
      this.props.fetchDashboards(
        apiKey,
        user,
      )
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.dashboards.length > prevProps.dashboards.length && prevState.showModal) {
        this.setState({showModal: false})
      }
    }

    createDashboard = (name) => {
        const user = this.props.user.username;
        const apiKey = this.props.user.api_key;

        this.props.createDashboard(
          apiKey,
          user,
          name,
        ).then((response) => {
          this.setState({
            showModal: false,
            hasCreated: response,
          })
       });
    }

    removeDashboard = (dashboardId) => {
      const user = this.props.user.username;
      const apiKey = this.props.user.api_key;
      this.props.deleteDashboard(
        apiKey,
        user,
        dashboardId,
      );
    }

    render() {
      const { dashboards } = this.props;

      let content = (
        <div className="row">
          <div className="col-md-8">
            <div className="table-wrapper">
              <h2>Your Dashboards</h2>
              <div className="table-header">
                <button style={{ marginRight: '1em' }} type="button" onClick={() => this.setState({showModal: true})} className="btn btn-primary">
                  Create a Dashboard
                </button>
              </div>

              {dashboards.length === 0 ?
                <div className="sad-face"><p style={{ textAlign: 'center' }} className="lead">You have no dashboards yet, get building!</p></div> :
                <Table bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {dashboards.map((dashboard) => {
                    return (
                      <tr key={dashboard.id}>
                        <td><Link to={`/dashboards/${dashboard.id}/edit`}>{dashboard.name}</Link></td>
                        <td>{new Date(dashboard.created_at).toLocaleString()}</td>
                        <td>{new Date(dashboard.updated_at).toLocaleString()}</td>
                        <td width="50"><Link to={`/dashboards/${dashboard.id}/view`}>View</Link></td>
                        <td width="40">
                          <button onClick={() => this.removeDashboard(dashboard.id)} className="btn btn-link table-btn float-right"><i className="fa fa-trash" /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>}
            </div>
          </div>
          <div className="col-md-4">
            <DataProviderTable />
          </div>
        </div>
      );

      if(this.props.loader) {
        content = <Loader />;
      };

      if(this.state.hasCreated) {
        content = <Redirect to={`/dashboards/${this.state.hasCreated.id}/edit`} />;
      };

      return (
        <React.Fragment>
          {content}
          <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})}>
            <Modal.Header closeButton>
              <Modal.Title>Create a new dashboard</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddDashboard add={this.createDashboard} />
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
        </React.Fragment>
      )
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardList);