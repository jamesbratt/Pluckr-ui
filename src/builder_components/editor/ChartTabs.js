import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import DataSetList from '../datasets/DataSetList';
import ChartXaxisSettings from './ChartXaxisSettings';
import ChartSettings from './ChartSettings';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
  };
};

class ChartTabs extends Component {
  render() {
    return (
      <Tabs defaultActiveKey="operations" id="dataset-tabs">
      <Tab eventKey="operations" title="Datasets">
        <DataSetList chartId={this.props.chartId} url={this.props.url} />
      </Tab>
      <Tab eventKey="settings" title="Chart Configuration">
        <ChartSettings chartId={this.props.chartId} />
      </Tab>
      <Tab eventKey="axis" title="X-axis Configuration">
        <ChartXaxisSettings chartId={this.props.chartId} />
      </Tab>
      <Tab eventKey="styling" title="Chart Styling">
        Styling
      </Tab>
    </Tabs>
    )
  };
};

export default connect(
  mapStateToProps,
)(ChartTabs);
