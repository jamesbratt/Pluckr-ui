import * as React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { fetchDataSources } from './actions';

const ChartConfigHoc = WrappedComponent => {

  const mapStateToProps = (state) => {
    return {
      user: state.user[0],
      charts: state.charts,
      sources: state.sources.data,
      datasets: state.datasets,
      loader: state.loader,
    };
  };

  const mapDispatchToProps = {
    fetchDataSources,
  };

  class ComponentWithNav extends React.Component {

    componentDidMount() {
      const user = this.props.user.username;
      const apiKey = this.props.user.api_key;

      const sourcesLoaded = this.props.sources.filter(source => source.chart === parseInt(this.props.match.params.id));

      if (sourcesLoaded.length === 0) {
        this.props.fetchDataSources(
          apiKey,
          user,
          this.props.match.params.id,
        )
      }
    }

    render() {
      return (
        <Row style={{ height: '100vh' }}>
          <Col md={2} className="sidebar">
            <Nav defaultActiveKey="/home" className="flex-column">
              <Link className="side-nav-item" to={`/charts/${this.props.match.params.id}/data-sources`}>Data Sources</Link>
              <Link className="side-nav-item" to={`/charts/${this.props.match.params.id}/chart`}>Chart Editor</Link>
            </Nav>
          </Col>
          <Col style={{ marginBottom: '1em' }} md={10}>
            <WrappedComponent {...this.props} />
          </Col>
        </Row>
      );
    }
  };

  return connect(mapStateToProps, mapDispatchToProps)(ComponentWithNav);
};

export default ChartConfigHoc;