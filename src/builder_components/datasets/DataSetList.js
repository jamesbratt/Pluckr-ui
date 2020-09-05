import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import AddDataSet from './AddDataSet';
import { connect } from 'react-redux';
import { createDataSet, deleteDataset } from '../../actions/dataset';
import { Link, Redirect } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    datasets: state.datasets,
  };
};

const mapDispatchToProps = {
  deleteDataset,
  createDataSet,
}

class DataSetList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      createChartModalShow: false,
      hasCreated: null,
    }
  }

  addDataset = (name, chartId, sources, rawData) => {

      const { api_key, username } = this.props.user;

      this.props.createDataSet(
        api_key,
        username,
        name,
        chartId,
        sources,
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
    const dataSetsToDisplay = this.props.datasets.filter(dataset => dataset.chart.id === parseInt(this.props.chartId));
    return (
      <React.Fragment>
        {
          dataSetsToDisplay.length > 0 ?
          <React.Fragment>
            {
              this.state.hasCreated ? <Redirect to={`/charts/${this.state.hasCreated.chart.id}/chart/edit-dataset/${this.state.hasCreated.id}`} />
              : <React.Fragment>
                <div className="table-header">
                  <button className="btn btn-primary" onClick={() =>this.setState({ createChartModalShow: true })}>Create a Dataset</button>
                </div>
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Data Sources</th>
                      <th>Data Providers</th>
                      <th>Updated At</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSetsToDisplay.map(dataset => {
                      const dataSources = dataset.sources.reduce((acc, curr) => {
                        return acc += `${curr.name}, `
                      }, '');

                      const providers = dataset.sources.reduce((acc, curr) => {
                        return acc += `${curr.data_provider_name}, `
                      }, '');

                      return (
                        <tr key={dataset.id}>
                          <td><Link to={`${this.props.url}/edit-dataset/${dataset.id}`}>{dataset.name}</Link></td>
                          <td>{dataSources}</td>
                          <td>{providers}</td>
                          <td>{dataset.updated_at}</td>
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
