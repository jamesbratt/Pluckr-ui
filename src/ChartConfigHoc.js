import * as React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { fetchDatasets } from './actions/dataset';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

const ChartConfigHoc = WrappedComponent => {

  const mapStateToProps = (state) => {
    return {
      user: state.user[0],
    };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      fetchDatasets: (apiKey, user, chartId) => {
        dispatch(fetchDatasets(
          apiKey,
          user,
          chartId,
        ));
      }
    };
  };

  class ComponentWithNav extends React.Component {
    
    render() {
      return (
        <Row>
          <Col md={2}>
            <Nav defaultActiveKey="/home" className="flex-column">
              <Nav.Link><Link to={`/charts/${this.props.match.params.id}/data-sources`}>Data Sources</Link></Nav.Link>
              <Nav.Link><Link to={`/charts/${this.props.match.params.id}/chart`}>Chart Editor</Link></Nav.Link>
            </Nav>
          </Col>
          <Col md={10}>
            <WrappedComponent {...this.props} />
          </Col>
        </Row>
      );
    }
  };

  return connect(mapStateToProps, mapDispatchToProps)(ComponentWithNav);
};

export default ChartConfigHoc;