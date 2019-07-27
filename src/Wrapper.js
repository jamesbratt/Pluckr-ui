import React, { Component } from 'react';
import Charts from './Charts';
import DataProviderList from './builder_components/DataProviderList';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { connect } from 'react-redux';
import { setDataProviders } from './actions';
import { getToken } from './utils/Helpers';

const mapStateToProps = state => {
  return state
};

class Wrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
          providerModalShow: false,
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

    closeProviderModal = () => {
      this.setState({ providerModalShow: false })
    }

    render() {
      return (
        <React.Fragment>
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
                        <img height={40} src={provider.icon} alt={provider.provider} />
                      </div> 
                    </OverlayTrigger> :
                  null;
                })
              }
              <button onClick={() => this.setState({providerModalShow: true})} className="btn btn-outline-secondary my-2 my-sm-0">Connect Data Providers</button>
            </div>
          </div>
            <Charts />
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
        </React.Fragment>
      )
    }
}

export default connect(
  mapStateToProps
)(Wrapper);