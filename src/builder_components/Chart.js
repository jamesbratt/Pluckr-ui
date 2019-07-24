import React, { Component } from 'react';
import DataSourceList from './data_sources/DataSourceList';
import DataSourceDetail from './data_sources/DataSourceDetail';

const VIEWS = {
  datasource_list: 'DATASOURCE_LIST',
  datasource_detail: 'DATASOURCE_DETAIL',
};

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      views: VIEWS.datasource_list,
      editingId: null,
    };
  }

  switchView = (view, id = null) => {
    const payload = { views: view };

    if (id) {
      payload['editingId'] = id;
    };

    this.setState(payload)
  }

  render() {
    let view = null;

    switch(this.state.views) {
      case VIEWS.datasource_detail:
        view = <DataSourceDetail chartId={this.props.id} id={this.state.editingId} />;
        break;
      default:
        view = <DataSourceList chartId={this.props.id} switchView={this.switchView} />
    }
    return (
      <React.Fragment>
        {view}
      </React.Fragment>
    );
  };
};

export default Chart;
