import React, { Component } from 'react';
import Charts from './Charts';
import DataProviderList from './builder_components/DataProviderList';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ChartConfigHoc from './ChartConfigHoc';
import EditorWrapper from './builder_components/editor/EditorWrapper';
import TemplateList from './builder_components/templates/TemplateList';
import DeleteAccount from './builder_components/account/DeleteAccount';
import DataSourceList from './builder_components/data_sources/DataSourceList';
import DataSourceDetail from './builder_components/data_sources/DataSourceDetail';
import { Link, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { setDataProviders, setLoader } from './actions';
import { getToken } from './utils/Helpers';

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
        }
    }

    logout = () => {
      localStorage.removeItem('pluckr_token');
      localStorage.removeItem('token');
      window.location.href = "/";
    }

    componentDidMount() {
      this.props.dispatch(
        setLoader(
        true
        )
      );

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
      const tokenObj = localStorage.getItem('pluckr_token');
      if (!tokenObj) {
        return <Redirect to='/' />;
      }

      return (
        <React.Fragment>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">Pluckr</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Link className="nav-link" to="/">Charts</Link>
              <Link className="nav-link" to="/charts/templates">Templates</Link>
            </Nav>
            <Nav>
              <Link className="nav-link" to="/account">Account for {this.props.user[0].username}</Link>
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
            </div>
          </div>
        </React.Fragment>
      )
    }
}

export default connect(
  mapStateToProps
)(Wrapper);