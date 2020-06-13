import React, { Component } from 'react';
import Visualisation from './Visualisation';

import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { fetchDashboards } from '../../actions/dashboards';

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    dashboards: state.dashboards,
    loader: state.loader,
  };
};

const mapDispatchToProps = {
  fetchDashboards,
};

class ViewDashboard extends Component {

  componentDidMount() {
    const user = this.props.user.username;
    const apiKey = this.props.user.api_key;
    this.props.fetchDashboards(apiKey, user)
  }

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
    const charts = dashboard ? dashboard.charts.sort((a, b) => a.order - b.order)
      .map(chart => <Visualisation config={chart} />) : [];

    const rows = this.generateRows(charts, 2);

    return (
      <>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><Link to={`/dashboards`}>Back to Dashboards</Link></li>
            <li class="breadcrumb-item active" aria-current="page">{dashboard ? dashboard.name : '...'}</li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-md-12">
            <div className="editor-header">
              <h2 style={{ display: 'inline-block' }}>{dashboard ? dashboard.name : '...'}</h2>
              <Link className="float-right" to={`/dashboards/${id}/edit`}>Edit Dashboard</Link>
            </div>
            {rows.map((row) => (
              <div className="row">
              {
                row.map((col) => (
                  <div className="col-md-6"><div className="chart-wrapper">{ col }</div></div>
                ))
              }
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDashboard);