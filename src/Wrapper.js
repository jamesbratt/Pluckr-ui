import React, { Component } from 'react';
import Charts from './Charts';
import DataProviderList from './builder_components/DataProviderList';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ChartConfigHoc from './ChartConfigHoc';
import EditorWrapper from './builder_components/editor/EditorWrapper';
import TemplateList from './builder_components/templates/TemplateList';
import DashboardList from './builder_components/dashboards/DashboardList';
import EditDashboard from './builder_components/dashboards/EditDashboard'
import ViewDashboard from './builder_components/dashboards/ViewDashboard';
import DeleteAccount from './builder_components/account/DeleteAccount';
import DataSourceList from './builder_components/data_sources/DataSourceList';
import DataSourceDetail from './builder_components/data_sources/DataSourceDetail';
import Welcome from './builder_components/Welcome';
import Cookies from 'js-cookie';

import { Link, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

const DataSourceListWrapped = ChartConfigHoc(DataSourceList);
const DataSourceDetailWrapped = ChartConfigHoc(DataSourceDetail);
const ChartEditorWrapped = ChartConfigHoc(EditorWrapper);

const mapStateToProps = state => {
  return state
};

class Wrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
          providerModalShow: false,
          welcomeModalShow: localStorage.getItem('seenWelcome') ? false : true
        }
    }

    logout = () => {
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = { expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000) };
      if (isProduction) {
        cookieOptions.domain = 'app.pluckr.io';
      }
      Cookies.set('pluckr_token', '', cookieOptions);
      window.location.href = "/";
    }

    closeProviderModal = () => {
      this.setState({ providerModalShow: false })
    }

    closeWelcomeModal = () => {
      this.setState({ welcomeModalShow: false })
    }

    render() {
      const tokenObj = Cookies.get('pluckr_token');

      if (!tokenObj) {
        return <Redirect to='/' />;
      }

      return (
        <React.Fragment>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">Pluckr<sup>Beta</sup></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Link className="nav-link" to="/">Charts</Link>
              <Link className="nav-link" to="/charts/templates">Templates</Link>
              <Link className="nav-link" to="/dashboards">Dashboards</Link>
            </Nav>
            <Nav>
              <Link className="nav-link" to="/account">Account for {this.props.user[0].username}</Link>
              <Nav.Link rel="noopener noreferrer" target="_blank" href="https://pluckr.io/documentation/">Documentation</Nav.Link>
              <Nav.Link href="mailto:support@pluckr.io">Support</Nav.Link>
              <Nav.Link onClick={this.logout}>Log Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div id='chart-canvas'>
          <div className='container-fluid wrapper'>
            <Route
              exact
              path={'/charts'}
              render={() => <Charts />}
            />
            <Route
              exact
              path={'/dashboards'}
              render={() => <DashboardList />}
            />

            <Route path={`/dashboards/:id/edit`} component={EditDashboard} />
            <Route path={`/dashboards/:id/view`} component={ViewDashboard} />

            <Route
              exact
              path={'/account'}
              render={() => <DeleteAccount />}
            />
            <Route
              exact
              path={'/charts/templates'}
              component={TemplateList}
            />
            <Route path={`/charts/:id/chart`} component={ChartEditorWrapped} />
            <Route path={`/charts/:id/data-sources`} component={DataSourceListWrapped} />
            <Route path={`/charts/:id/create-data-source`} component={DataSourceDetailWrapped} />
            <Route path={`/charts/:id/edit-data-source/:data_source_id`} component={DataSourceDetailWrapped} />
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

            <Modal size="lg" show={this.state.welcomeModalShow}>
              <Welcome onClose={this.closeWelcomeModal} />
            </Modal>
            </div>
          </div>
        </React.Fragment>
      )
    }
}

export default connect(
  mapStateToProps,
)(Wrapper);