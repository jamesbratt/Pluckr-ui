import React, { Component } from 'react';
import Charts from './Charts';
import { connect } from 'react-redux';
import { setDataProviders } from './actions';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './css/builder.css';

const mapStateToProps = state => {
  return state
};

class Wrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
          providerModalShow: false
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
            <Charts />
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