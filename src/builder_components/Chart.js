import React, { Component } from 'react';
import DataSourceController from './data_sources/DataSourceController';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { connect } from 'react-redux';
import { switchSourceView } from '../actions';

const mapStateToProps = (state) => {
  return {
    loader: state.loader,
    user: state.user[0],
    sources: state.sources,
  };
};

class Chart extends Component {

  render() {
    return (
      <Row>
        <Col md={2}>
          <Nav className="flex-column">
            <Nav.Link onClick={() => this.props.dispatch(switchSourceView('SOURCE_LIST_VIEW'))}>Data Sources</Nav.Link>
            <Nav.Link eventKey="link-1">Chart Editor</Nav.Link>
          </Nav>
        </Col>
        <Col md={10}>
          <DataSourceController id={this.props.id} />
        </Col>
      </Row>
    );
  };
};

export default connect(mapStateToProps)(Chart);
