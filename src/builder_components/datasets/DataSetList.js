import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import AddDataSet from './AddDataSet';
import { connect } from 'react-redux';
import { createDataSet, deleteDataset, fetchDatasets } from '../../actions/dataset';
import { Link, Redirect } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    datasets: state.datasets,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDatasets: (apiKey, user, chartId) => {
      dispatch(fetchDatasets(
        apiKey,
        user,
        chartId,
      ));
    },
    deleteDataset: (apiKey, user, dataSetId) => {
      dispatch(deleteDataset(
        apiKey,
        user,
        dataSetId,        
      ))
    },
    createDataSet: (
      api_key,
      username,
      name,
      chartId,
      sourceId,
      rawData, 
    ) => {
      return dispatch(createDataSet(
        api_key,
        username,
        name,
        chartId,
        sourceId,
        rawData,       
      ))      
    }
  };
};

class DataSetList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      createChartModalShow: false,
      hasCreated: null,
    }
  }

  componentDidMount() {
    const { api_key, username } = this.props.user;
    this.props.fetchDatasets(
      api_key,
      username,
      this.props.chartId,
    );
  };

  addDataset = (name, chartId, sourceId, rawData) => {

      const { api_key, username } = this.props.user;
  
      this.props.createDataSet(
        api_key,
        username,
        name,
        chartId,
        sourceId,
        rawData,
      ).then((response) => {
        this.setState({
          createChartModalShow: false,
          hasCreated: response,
        })
     });
  }

  delete = (id) => {
    const { api_key, username } = this.props.user;
    this.props.deleteDataset(
      api_key,
      username,
      id,
    );
  }

  render() {
    return (
      <React.Fragment>
        {
          this.props.datasets.length > 0 ?
          <React.Fragment>
            {
              this.state.hasCreated ? <Redirect to={`/charts/${this.state.hasCreated.chart}/chart/edit-dataset/${this.state.hasCreated.id}`} />
              : <React.Fragment>
                <button className="btn btn-primary" onClick={() =>this.setState({ createChartModalShow: true })}>Create a Dataset</button>
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Data Source</th>
                      <th>Data Provider</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.datasets.map(dataset => {
                      return (
                        <tr key={dataset.id}>
                          <td><Link to={`${this.props.url}/edit-dataset/${dataset.id}`}>{dataset.name}</Link></td>
                          <td>{dataset.data_source_name}</td>
                          <td>{dataset.provider}</td>
                          <td width="40">
                            <button onClick={() => this.delete(dataset.id)} className="btn btn-link table-btn"><i className="fa fa-trash" /></button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </React.Fragment>
            }
          </React.Fragment> :
          <div>
            <h3>Get started by creating a data set</h3>
            <p className="lead">Datasets represent the data visualised in your chart</p>
            <button className="btn btn-primary" onClick={() => this.setState({ createChartModalShow: true })}>Create a Dataset</button>
          </div>
        }
        <Modal show={this.state.createChartModalShow} onHide={() => this.setState({createChartModalShow: false})}>
          <Modal.Header closeButton>
            <Modal.Title>Create a New Dataset</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <AddDataSet add={this.addDataset} chartId={this.props.chartId} close={() => this.setState({createChartModalShow: false})} />
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataSetList);
