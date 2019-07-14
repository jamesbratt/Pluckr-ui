import React, { Component } from 'react';
import Charts from './Charts';
import Chart from './builder_components/Chart';
import { connect } from 'react-redux';
import { setDataProviders } from './actions';
import DataProviderList from './builder_components/DataProviderList';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Nav from 'react-bootstrap/Nav';
import { getToken } from './utils/Helpers';

const VIEWS = {
  chart_list: 'CHART_LIST',
  chart_detail: 'CHART_DETAIL',
};

const mapStateToProps = state => {
  return state
};

class Wrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
          providerModalShow: false,
          views: VIEWS.chart_list,
          chartToEdit: null,
        }
    }

    componentDidMount() {
      const cachedProviders = this.props.dataProviders.filter(dataProvider => {
          if (getToken(dataProvider.provider)) {
              return dataProvider;
          }
      });
    
      this.props.dispatch(
          setDataProviders(
          cachedProviders
          )
      );
    }

    switchView = (view, chartId = null) => {
      const payload = { views: view };

      if (chartId) {
        const chart = this.props.charts.find(chart => chart.id === chartId);
        payload['chartToEdit'] = chart;
      }

      this.setState(payload)
    }

    logout = () => {
      localStorage.removeItem('pluckr_token');
      window.location.href = "/";
    }

    closeProviderModal = () => {
      this.setState({ providerModalShow: false })
    }

    render() {
      let view = null;

      switch(this.state.views) {
        case VIEWS.chart_list:
          view = <Charts switchView={this.switchView} />
          break;
        case VIEWS.chart_detail:
          view = <Chart
            id={this.state.chartToEdit.id}
            name={this.state.chartToEdit.name}
            chartConfig={this.state.chartToEdit}
          />
          break;
        default:
          view = null;
      }

      return (
        <div id='chart-canvas'>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/">Pluckr</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link onClick={() => this.switchView(VIEWS.chart_list)}>Charts</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={this.logout}>Log Out</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <div className='container-fluid wrapper'>
            <div className="data-providers clearfix">
              <div className="float-right">
                {
                  this.props.dataProviders.map(provider => {
                    return provider.isActive ?
                      <OverlayTrigger
                        key={provider.provider}
                        placement='bottom'
                        overlay={
                          <Tooltip id={`tooltip-bottom`}>
                           Connected to {provider.provider}
                          </Tooltip>
                        }
                      >
                        <div className="active-provider">
                          <img width={50} src={provider.icon} alt={provider.provider} />
                        </div> 
                      </OverlayTrigger> :
                    null;
                  })
                }
                <button onClick={() => this.setState({providerModalShow: true})} className="btn btn-outline-secondary my-2 my-sm-0">Connect Data Providers</button>
              </div>
            </div>
            {view}
          </div>
          <Modal show={this.state.providerModalShow} onHide={this.closeProviderModal}>
            <Modal.Header closeButton>
              <Modal.Title>Connect to a data provider</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DataProviderList dataProviders={this.props.dataProviders} />
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
        </div>
      )
    }
}

export default connect(
    mapStateToProps
  )(Wrapper);