import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

import { switchHelpTopic } from '../actions/help';
import { HELP_TOPICS } from '../Constants';
import { connect } from 'react-redux';

const Help = ({ topic, switchHelpTopic }) => {
  let helpContent = null

  switch(topic) {
    case HELP_TOPICS.data_providers:
      helpContent = <h5>Data Providers</h5>
      break
    case HELP_TOPICS.data_sources:
      helpContent = <h5>Data Sources</h5>
      break
    case HELP_TOPICS.datasets:
      helpContent = <h5>Datasets</h5>
      break
    case HELP_TOPICS.operations:
      helpContent = <h5>Operations</h5>
      break
    case HELP_TOPICS.dashboards:
      helpContent = <h5>Dashboards</h5>
      break
    case HELP_TOPICS.templates:
      helpContent = <h5>Templates</h5>
      break
    default: 
      helpContent = <h5>Overview</h5>
  }

  const classes = 'list-group-item list-group-item-action'
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Documentation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={3}>
            <div class="list-group">
              <button onClick={() => switchHelpTopic(null)} type="button" className={`${classes}${!topic ? ' active' : ''}` }>
              Overview
              </button>
              <button onClick={() => switchHelpTopic(HELP_TOPICS.data_providers)} type="button" className={`${classes}${topic === HELP_TOPICS.data_providers ? ' active' : ''}` }>Data Providers</button>
              <button onClick={() => switchHelpTopic(HELP_TOPICS.data_sources)} type="button" className={`${classes}${topic === HELP_TOPICS.data_sources ? ' active' : ''}` }>Data Sources</button>
              <button onClick={() => switchHelpTopic(HELP_TOPICS.datasets)} type="button" className={`${classes}${topic === HELP_TOPICS.datasets ? ' active' : ''}` }>Datasets</button>
              <button onClick={() => switchHelpTopic(HELP_TOPICS.operations)} type="button" className={`${classes}${topic === HELP_TOPICS.operations ? ' active' : ''}` }>Operations</button>
              <button onClick={() => switchHelpTopic(HELP_TOPICS.dashboards)} type="button" className={`${classes}${topic === HELP_TOPICS.dashboards ? ' active' : ''}` }>Dashboards</button>
              <button onClick={() => switchHelpTopic(HELP_TOPICS.templates)} type="button" className={`${classes}${topic === HELP_TOPICS.templates ? ' active' : ''}` }>Templates</button>
            </div>
          </Col>
          <Col md={9}>
            {helpContent}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </>
  );
}

export default connect((state) => ({ topic: state.help.topic }), { switchHelpTopic })(Help);