import React, { Component } from 'react';
import Charts from './Charts';
import DataProviderList from './builder_components/DataProviderList';
import { connect } from 'react-redux';
import { setDataProviders } from './actions';
import Modal from 'react-bootstrap/Modal';

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

    closeProviderModal = () => {
      this.setState({ providerModalShow: false })
    }

    render() {
      const activeProviders = this.props.dataProviders.filter(provider => provider.isActive === true);
      if (activeProviders.length === 0 && !this.state.providerModalShow) {
        this.setState({ providerModalShow: true });
      }
      return (
        <div id='chart-canvas'>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">Pluckr</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                <DataProviderList dataProviders={this.props.dataProviders} />
              </ul>
            </div>
          </nav>
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