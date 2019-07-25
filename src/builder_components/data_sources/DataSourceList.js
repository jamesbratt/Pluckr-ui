import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import Loader from '../../Loader';
import { fetchDataSources } from '../../actions';

const mapStateToProps = (state) => {
  return {
    sources: state.sources,
    user: state.user[0],
    loader: state.loader,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDataSources: (apiKey, user, chartId) => {
      dispatch(fetchDataSources(
        apiKey,
        user,
        chartId,
      ));
    },
  };
};

class DataSourceList extends Component {

  componentDidMount() {
    const { api_key, username } = this.props.user;
    this.props.fetchDataSources(
      api_key,
      username,
      this.props.chartId,
    );
  };

  render() {
    return (
      <React.Fragment>
        {
          this.props.loader ? <Loader /> : 
            this.props.sources.length > 0 ?
            <React.Fragment>
              <h2>Available Data Sources</h2>
              <button onClick={() => this.props.switchView('DATASOURCE_DETAIL')} className="btn btn-primary">Create a Data Source</button>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Provider</th>
                    <th>Resource</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.sources.map(source => {
                    return (
                      <tr>
                        <td>{source.name}</td>
                        <td>{source.provider}</td>
                        <td>{source.resource}</td>
                        <td><button onClick={() => this.props.switchView('DATASOURCE_DETAIL', source.id)} className="btn btn-sm btn-primary">Edit Data Source</button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </React.Fragment> :
            <div>
              <h2>Get started by creating a data source</h2>
              <p className="lead">Data sources use your connected data providers to retrieve specific data</p>
              <button onClick={() => this.props.switchView('DATASOURCE_DETAIL')} className="btn btn-primary">Create a Data Source</button>
            </div>
        }
      </React.Fragment>
    )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataSourceList);
