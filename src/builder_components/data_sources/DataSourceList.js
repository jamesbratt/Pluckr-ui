import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import { fetchDataSources } from '../../actions';
import { Link } from "react-router-dom";

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
    }
  };
};

class DataSourceList extends Component {

  componentDidMount() {
    const { api_key, username } = this.props.user;
    this.props.fetchDataSources(
      api_key,
      username,
      this.props.match.params.id,
    );
  };

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const { api_key, username } = this.props.user;
      this.props.fetchDataSources(
        api_key,
        username,
        this.props.match.params.id,
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        {
            this.props.sources.data.length > 0 ?
            <React.Fragment>
              <h2>Available Data Sources</h2>
              <Link className="btn btn-primary" to="create-data-source">Create a Data Source</Link>
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
                        <td><Link className="btn btn-sm btn-primary" to={`edit-data-source/${source.id}`}>Edit</Link></td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </React.Fragment> :
            <div>
              <h2>Get started by creating a data source</h2>
              <p className="lead">Data sources use your connected data providers to retrieve specific data</p>
              <Link className="btn btn-primary" to="create-data-source">Create a Data Source</Link>
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
