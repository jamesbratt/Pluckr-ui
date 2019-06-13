import React, { Component } from 'react';
import Charts from './Charts';
import { connect } from 'react-redux';
import { setDataProviders } from './actions';
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
        }
    }

    componentDidMount() {
      /*const pings = this.props.dataProviders.map(
        dataProvider => dataProvider.ping()
      );
    
      Promise.all(pings).then(responses => { 
        this.props.dispatch(
          receiveUser(
            responses
          )
        );
      });*/
    }

    closeProviderModal = () => {
      this.setState({ providerModalShow: false })
    }

    render() {
      let view = null;

      switch(this.state.views) {
        case VIEWS.chart_list:
          view = <Charts />
          break;
        case VIEWS.chart_detail:
          view = <Charts />
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
              </Nav>
              <Nav>
                <button onClick={() => this.setState({providerModalShow: true})} class="btn btn-primary my-2 my-sm-0">Connect Data Providers</button>
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