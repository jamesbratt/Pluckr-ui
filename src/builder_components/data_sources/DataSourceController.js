import React, { Component } from 'react';
import DataSourceList from './DataSourceList';
import DataSourceDetail from './DataSourceDetail';
import WithLoading from '../../LoaderHoc.js';
import { connect } from 'react-redux';
import { fetchDataSources } from '../../actions';

const DataSourceListWithLoading = WithLoading(DataSourceList);
const DataSourceDetailWithLoading = WithLoading(DataSourceDetail);

const mapStateToProps = (state) => {
  return {
    loader: state.loader,
    user: state.user[0],
    sources: state.sources,
  };
};

class DataSourceController extends Component {

  componentDidMount() {
    const { api_key, username } = this.props.user;
    this.props.dispatch(fetchDataSources(
      api_key,
      username,
      this.props.id,
    ));
  };

  render() {
    let view = null;

    switch(this.props.sources.view) {
      case 'SOURCE_LIST_VIEW':
        view = <DataSourceListWithLoading chartId={this.props.id} />
        break;
      case 'SOURCE_CREATE_VIEW':
      case 'SOURCE_EDIT_VIEW':
        view = <DataSourceDetailWithLoading chartId={this.props.id} id={this.props.sources.active} />;
        break;
      default:
        view = null;
        break
    }
  
    return (
      <React.Fragment>
        {view}
      </React.Fragment>
    );
  };
};

export default connect(mapStateToProps)(DataSourceController);
