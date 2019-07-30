import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import DataSetList from '../datasets/DataSetList';
import AxisList from '../axis/AxisList';
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
      <Tab eventKey="axis" title="Chart Axis Configuration">
        <AxisList />
      </Tab>
      <Tab eventKey="styling" title="Chart Styling">
        Styling
      </Tab>
      <Tab eventKey="settings" title="Chart Configuration">
        Setting
      </Tab>
    </Tabs>
    )
  };
};

export default connect(
  mapStateToProps,
)(ChartTabs);
