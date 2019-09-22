import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Loader from '../../Loader';
import { connect } from 'react-redux';
import { deleteDataSource, fetchDataSources } from '../../actions';
import { Link } from "react-router-dom";

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
    deleteDataSource: (apiKey, user, dataSourceId) => {
      dispatch(deleteDataSource(
        apiKey,
        user,
        dataSourceId,
      ));
    }
  };
};

class DataSourceList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
    }
  }

  componentDidMount() {
    const { api_key, username } = this.props.user;
    this.props.fetchDataSources(
      api_key,
      username,
      this.props.match.params.id,
    )
  };

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const { api_key, username } = this.props.user;
      this.props.fetchDataSources(
        api_key,
        username,
        this.props.match.params.id,
      )
    }
  };

  delete = (id) => {
    const { api_key, username } = this.props.user;
    this.props.deleteDataSource(
      api_key,
      username,
      id,
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.props.loader ? <Loader /> :
            this.props.sources.data.length > 0 ?
            <React.Fragment>
              <h2>Available Data Sources</h2>
              <Link className="btn btn-primary" to="create-data-source">Create a Data Source</Link>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Provider</th>
                    <th>Resource</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.sources.data.map(source => {
                    return (
                      <tr key={source.id}>
                        <td><Link to={`edit-data-source/${source.id}`}>{source.name}</Link></td>
                        <td>{source.provider}</td>
                        <td>{source.resource}</td>
                        <td width="40">
                          <button onClick={() => this.delete(source.id)} className="btn btn-link table-btn float-right"><i className="fa fa-trash" /></button>
                        </td>
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
