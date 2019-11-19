import * as React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { addNotification } from './actions/notification';
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
    addNotification,
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

    publish = (chart_id) => {
      const user = this.props.user.username;
      const apiKey = this.props.user.api_key;
  
      const payload = {
        chart_id,
      };
  
      fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/library/publish/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${user}:${apiKey}`
        },
        body: JSON.stringify(payload)
      })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        this.props.addNotification(
          { message: 'Chart has been successfully published to the template library', type: 'success' }
        );
      })
      .catch(error => this.props.addNotification({ message: error.message, type: 'error' }));
    }
    
    render() {
      return (
        <Row>
          <Col md={2}>
            <Nav defaultActiveKey="/home" className="flex-column">
              <Link className="side-nav-item" to={`/charts/${this.props.match.params.id}/data-sources`}>Data Sources</Link>
              <Link className="side-nav-item" to={`/charts/${this.props.match.params.id}/chart`}>Chart Editor</Link>
              <button onClick={() => this.publish(this.props.match.params.id)} className="side-nav-item">Publish</button>
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