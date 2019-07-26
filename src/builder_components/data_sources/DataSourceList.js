import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import { fetchDataSources, setActiveDataSource } from '../../actions';

const mapStateToProps = (state) => {
  return {
    sources: state.sources,
    user: state.user[0],
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
    setActiveDataSource: (id) => {
      dispatch(setActiveDataSource(
        id,
      ));
    },
  };
};

class DataSourceList extends Component {

  render() {
    return (
      <React.Fragment>
        {
            this.props.sources.data.length > 0 ?
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
                  {this.props.sources.data.map(source => {
                    return (
                      <tr>
                        <td>{source.name}</td>
                        <td>{source.provider}</td>
                        <td>{source.resource}</td>
                        <td><button onClick={() => this.props.setActiveDataSource(source.id)} className="btn btn-sm btn-primary">Edit Data Source</button></td>
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
