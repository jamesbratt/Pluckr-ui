import React, { Component } from 'react';
import DataSourceList from './data_sources/DataSourceList';
import DataSourceDetail from './data_sources/DataSourceDetail';
import WithLoading from '../LoaderHoc.js';
import { connect } from 'react-redux';
import { fetchDataSources } from '../actions';

const DataSourceListWithLoading = WithLoading(DataSourceList);
const DataSourceDetailWithLoading = WithLoading(DataSourceDetail);

const VIEWS = {
  datasource_list: 'DATASOURCE_LIST',
  datasource_detail: 'DATASOURCE_DETAIL',
};

const mapStateToProps = (state) => {
  return {
    loader: state.loader,
    user: state.user[0],
    sources: state.sources,
  };
};

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      views: VIEWS.datasource_list,
      editingId: null,
    };
  }

  componentDidMount() {
    const { api_key, username } = this.props.user;
    this.props.dispatch(fetchDataSources(
      api_key,
      username,
      this.props.id,
    ));
  };

  switchView = (view, id = null) => {
    const payload = { views: view };

    if (id) {
      payload['editingId'] = id;
    };

    this.setState(payload)
  }

  render() {
    let view = null;

    if(this.props.sources.active || this.state.views === VIEWS.datasource_detail) {
        view = <DataSourceDetailWithLoading chartId={this.props.id} id={this.props.sources.active} />;
    } else { 
        view = <DataSourceListWithLoading chartId={this.props.id} switchView={this.switchView} />
    }
    return (
      <React.Fragment>
        {view}
      </React.Fragment>
    );
  };
};

export default connect(mapStateToProps)(Chart);
