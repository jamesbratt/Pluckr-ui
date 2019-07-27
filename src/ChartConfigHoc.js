import * as React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { Link } from "react-router-dom";

const ChartConfigHoc = WrappedComponent => {

  class ComponentWithNav extends React.Component {
    render() {
      return (
        <Row>
          <Col md={2}>
            <Nav defaultActiveKey="/home" className="flex-column">
              <Nav.Link><Link to={`/${this.props.match.params.id}/data-sources`}>Data Sources</Link></Nav.Link>
              <Nav.Link>Chart Editor</Nav.Link>
            </Nav>
          </Col>
          <Col md={10}>
            <WrappedComponent {...this.props} />;
          </Col>
        </Row>
      );
    }
  };

  return ComponentWithNav;
};

export default ChartConfigHoc;