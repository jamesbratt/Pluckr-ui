import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import AddDataSet from './AddDataSet';
import { connect } from 'react-redux';
import { deleteDataset, fetchDatasets } from '../../actions/dataset';
import { Link } from "react-router-dom";

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
    }
  };
};

class DataSetList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      createChartModalShow: false
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
            <button className="btn btn-primary" onClick={() =>this.setState({ createChartModalShow: true })}>Create a Dataset</button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Data Source</th>
                  <th>Edit/Delete</th>
                </tr>
              </thead>
              <tbody>
                {this.props.datasets.map(dataset => {
                  return (
                    <tr>
                      <td>{dataset.name}</td>
                      <td></td>
                      <td width="10%">
                        <Link className="btn btn-primary" to={`${this.props.url}/edit-dataset/${dataset.id}`}><i className="fa fa-edit" /></Link>
                        <button onClick={() => this.delete(dataset.id)} className="btn btn-danger"><i className="fa fa-trash" /></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
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
              <AddDataSet chartId={this.props.chartId} close={() => this.setState({createChartModalShow: false})} />
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
