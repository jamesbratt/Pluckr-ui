import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DataSetSettings from './DataSetSettings';
import Operations from '../operations/Operations';
import JSONTree from 'react-json-tree';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    datasets: state.datasets,
  };
};

class DataSetDetail extends Component {
  render() {
    const dataset = this.props.datasets.find(dataset => dataset.id === parseInt(this.props.match.params.dataset_id));
    return (
      <div>
        <h3>Configure Dataset</h3>
        <Tabs defaultActiveKey="operations" id="dataset-tabs">
        <Tab eventKey="operations" title="Operations">
          <Row>
            <Col md={4}>
              <Operations
                chartId={parseInt(this.props.match.params.id)}
                dataSetId={this.props.match.params.dataset_id}
                dataSourceId={dataset.data_source}
              />
            </Col>
            <Col md={8}>
              <JSONTree
                theme={{
                  tree: ({ style }) => ({
                    style: { ...style, padding: "1em" }, 
                  }),
                }}
                data={dataset.data}
              />
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="settings" title="Settings">
          <DataSetSettings dataSetId={this.props.match.params.dataset_id} />
        </Tab>
      </Tabs>
    </div>
    )
  };
};

export default connect(
  mapStateToProps,
)(DataSetDetail);
