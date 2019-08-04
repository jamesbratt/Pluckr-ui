import React, { Component } from 'react';
import Charts from './Charts';
import DataProviderList from './builder_components/DataProviderList';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ChartConfigHoc from './ChartConfigHoc';
import Chart from './builder_components/editor/Chart';
import DataSourceList from './builder_components/data_sources/DataSourceList';
import DataSourceDetail from './builder_components/data_sources/DataSourceDetail';
import { Link, Route } from "react-router-dom";
import { connect } from 'react-redux';
import { setDataProviders } from './actions';
import { getToken } from './utils/Helpers';

const DataSourceListWrapped = ChartConfigHoc(DataSourceList);
const DataSourceDetailWrapped = ChartConfigHoc(DataSourceDetail);
const ChartEditorWrapped = ChartConfigHoc(Chart);

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

    logout = () => {
      localStorage.removeItem('pluckr_token');
      window.location.href = "/";
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
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">Pluckr</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Link className="nav-link" to="/">Charts</Link>
            </Nav>
            <Nav>
              <Nav.Link onClick={this.logout}>Log Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
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
        <div id='chart-canvas'>
          <div className='container-fluid wrapper'>
            <Route
              exact
              path={'/'}
              render={() => <Charts />}
            />
            <Route path={`/:id/chart`} component={ChartEditorWrapped} />
            <Route path={`/:id/data-sources`} component={DataSourceListWrapped} />
            <Route path={`/:id/create-data-source`} component={DataSourceDetailWrapped} />
            <Route path={`/:id/edit-data-source/:data_source_id`} component={DataSourceDetailWrapped} />
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
          </div>
        </React.Fragment>
      )
    }
}

export default connect(
  mapStateToProps
)(Wrapper);