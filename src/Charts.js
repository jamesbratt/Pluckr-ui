import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { createChart, fetchCharts, deleteChart } from './actions/chart';
import AddChart from './builder_components/AddChart';
import { Link, Redirect } from "react-router-dom";
import GetStarted from './builder_components/charts/GetStarted';
import Loader from './Loader';

const ICON_MAPPER = {
  line: 'fa fa-line-chart',
  bar: 'fa fa-bar-chart',
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
          <h2 className="page-header">Your Charts</h2>
          <div className='row'>
            <div className='col-lg-3 col-xl-2'>
              <button onClick={() => this.setState({createChartModalShow: true})} className="add-chart-placeholder">
                Create from Scratch
              </button>
            </div>
            <div className='col-lg-3 col-xl-2'>
              <Link to={`/charts/templates`} className="add-template-placeholder">
                Create from Template
              </Link>
            </div>
            {
              charts.map((chart) => {
                return (
                  <div key={chart.name} className='col-lg-3 col-xl-2'>
                    <div className='add-chart-card'>
                      <div className="chart-icon"><i style={{fontSize: '3em', textAlign: 'center'}} className={ICON_MAPPER[chart.series_type]} /></div>
                      <div className="chart-card-inner">
                        <OverlayTrigger
                          key={chart.name}
                          placement='bottom'
                          overlay={
                            <Tooltip id={`tooltip-bottom`}>
                              {chart.name}
                            </Tooltip>
                          }
                        >
                          <h3>{chart.name}</h3>
                        </OverlayTrigger>
                        <div className="btn-group-fixe">
                          <Link style={{paddingLeft: '0'}} className="btn btn-link" to={`/charts/${chart.id}/data-sources`}>Edit</Link>
                          <button style={{paddingLeft: '0'}} className="btn btn-link" onClick={() => this.removeChart(chart.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>                
                )
              })
            }
          </div>
        </React.Fragment>
      );

      if(this.props.loader) {
        content = <Loader />;
      };

      if(activeProviders.length === 0 && charts.length === 0) {
        content = <GetStarted providers={this.props.dataProviders} />;
      };

      if(this.state.hasInstalled) {
        content = <Redirect to={`/charts/${this.state.hasInstalled.id}/data-sources`} />;
      };

      return (
        <React.Fragment>
          {content}
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