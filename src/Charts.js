import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import DataProviderTable from './builder_components/dataproviders/DataProviderTable';
import { createChart, fetchCharts, deleteChart } from './actions/chart';
import AddChart from './builder_components/AddChart';
import { Link, Redirect } from "react-router-dom";
import GetStarted from './builder_components/charts/GetStarted';
import Loader from './Loader';
import sadFace from './img/sad-face.png';

const ICON_MAPPER = {
  line: 'fa fa-line-chart',
  column: 'fa fa-bar-chart',
  pie: 'fa fa-pie-chart',
};

const mapStateToProps = (state) => {
  return {
    charts: state.charts,
    user: state.user[0],
    loader: state.loader,
    dataProviders: state.dataProviders,
  };
};

class Charts extends Component {
    constructor(props) {
      super(props);
      this.state = {
        createChartModalShow: false,
        hasInstalled: null,
      }
    }

    componentDidMount() {
      const user = this.props.user.username;
      const apiKey = this.props.user.api_key;
      this.props.dispatch(
        fetchCharts(
          apiKey,
          user,
        )
      );
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.charts.length > prevProps.charts.length && prevState.createChartModalShow) {
        this.setState({createChartModalShow: false})
      }
    }

    createChart = (name, chartType) => {
        const user = this.props.user.username;
        const apiKey = this.props.user.api_key;

        this.props.dispatch(
          createChart(
            apiKey,
            user,
            name,
            chartType,
          )
        ).then((response) => {
          this.setState({
            createChartModalShow: false,
            hasInstalled: response,
          })
       });
    }

    removeChart = (chartId) => {
      const user = this.props.user.username;
      const apiKey = this.props.user.api_key;
      this.props.dispatch(
        deleteChart(
          apiKey,
          user,
          chartId,
        )
      );
    }

    render() {
      const charts = this.props.charts.filter(chart => !chart.is_published);
      const activeProviders = this.props.dataProviders.filter(provider => provider.isActive);

      let content = (
        <React.Fragment>
          <div className="col-md-8">
            <div className="table-wrapper">
              <h2>Your Charts</h2>
              <div className="table-header">
                <button style={{ marginRight: '1em' }} type="button" onClick={() => this.setState({createChartModalShow: true})} className="btn btn-primary">
                  Create Chart from Scratch
                </button>
                <Link to={`/charts/templates`}>
                    Create Chart from Template
                </Link>
              </div>

              {charts.length === 0 ?
                <div className="sad-face"><p style={{ textAlign: 'center' }} className="lead">You have no charts yet, get building!</p></div> :
                <Table bordered hover>
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Chart Type</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {charts.map((chart) => {
                    return (
                      <tr key={chart.id}>
                        <td width="40">
                          <i className={ICON_MAPPER[chart.series_type]} />
                        </td>
                        <td><Link to={`/charts/${chart.id}/data-sources`}>{chart.name}</Link></td>
                        <td className="capitalize">{chart.series_type}</td>
                        <td>{new Date(chart.created_at).toLocaleString()}</td>
                        <td>{new Date(chart.updated_at).toLocaleString()}</td>
                        <td width="40">
                          <button onClick={() => this.removeChart(chart.id)} className="btn btn-link table-btn float-right"><i className="fa fa-trash" /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>}
            </div>
          </div>
        </React.Fragment>
      );

      if(this.props.loader) {
        content = <Loader />;
      };

      if(activeProviders.length === 0 && charts.length === 0 && !this.props.loader) {
        content = <GetStarted providers={this.props.dataProviders} />;
      };

      if(this.state.hasInstalled) {
        content = <Redirect to={`/charts/${this.state.hasInstalled.id}/data-sources`} />;
      };

      return (
        <React.Fragment>
          <div className="row">
            {content}
            <div className="col-md-4">
              <DataProviderTable />
            </div>
          </div>
          <Modal show={this.state.createChartModalShow} onHide={() => this.setState({createChartModalShow: false})}>
            <Modal.Header closeButton>
              <Modal.Title>Create a new chart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddChart add={this.createChart} />
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
        </React.Fragment>
      )
    }
}

export default connect(
  mapStateToProps
)(Charts);