import React, { Component } from 'react';
import Charts from './Charts';
import Chart from './builder_components/Chart';
import { connect } from 'react-redux';
import { setDataProviders } from './actions';
import DataProviderList from './builder_components/DataProviderList';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './css/builder.css';

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
      const pings = this.props.dataProviders.map(
        dataProvider => dataProvider.ping()
      );
    
      Promise.all(pings).then(responses => { 
        this.props.dispatch(
          setDataProviders(
            responses
          )
        );
      });
    }

    switchView = (view, chartId = null) => {
      const payload = { views: view };

      if (chartId) {
        const chart = this.props.charts.find(chart => chart.id === chartId);
        payload['chartToEdit'] = chart;
      }

      this.setState(payload)
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
                <button onClick={() => this.setState({providerModalShow: true})} className="btn btn-primary my-2 my-sm-0">Connect Data Providers</button>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <div className='container-fluid wrapper'>
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