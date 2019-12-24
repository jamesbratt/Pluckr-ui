import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import AddDataSet from './AddDataSet';
import { connect } from 'react-redux';
import { createDataSet, deleteDataset, dataSetUpdate } from '../../actions/dataset';
import { Link, Redirect } from "react-router-dom";
import { pathOr } from 'ramda';
import { executeOperations } from '../../data_parsing/parse';

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    datasets: state.datasets,
    operations: state.operations,
    sources: state.sources.data,
  };
};

const mapDispatchToProps = {
  dataSetUpdate,
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

  componentDidMount() {

    if (this.props.sources.length > 0) {
      // const dataset = this.props.datasets.find(dataset => dataset.id === parseInt(this.props.match.params.dataset_id));



      this.props.datasets.forEach(dataset => {
        const sourceIds = dataset.sources.map(source => source.id);
        const dataSetSources = this.props.sources.filter(source => sourceIds.includes(source.id));

        if (dataSetSources.length > 0) {
          const rawData = dataSetSources.length === 1 ?
          pathOr(null, ['rawData'], dataSetSources[0]) :
          dataSetSources.reduce((acc, curr) => {
            if (curr.rawData) {
              acc.push(curr.rawData);
            }
            return acc;
          }, []);

          if (this.props.operations) {
              const datasetOperations = this.props.operations.filter(operation => operation.dataset.id === parseInt(dataset.id));
              const sortedOperations = datasetOperations.sort(function(a, b) {
                return a.sort_order - b.sort_order;
              });

              const data = executeOperations(
                rawData,
                dataset,
                sortedOperations,
              );

              this.props.dataSetUpdate(dataset.id, { data: data });
          } else {
            this.props.dataSetUpdate(dataset.id, { data: rawData });
          }


        }
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (
      (this.props.operations &&
      prevProps.operations.length !== this.props.operations.length) &&
      (this.props.sources && prevProps.sources.length !== this.props.sources.length)
    ) {
      // const dataset = this.props.datasets.find(dataset => dataset.id === parseInt(this.props.match.params.dataset_id));


      this.props.datasets.forEach(dataset => {
        const datasetOperations = this.props.operations.filter(operation => operation.dataset.id === parseInt(dataset.id));
        const sortedOperations = datasetOperations.sort(function(a, b) {
          return a.sort_order - b.sort_order;
        });
        const sourceIds = dataset.sources.map(source => source.id);
        const dataSetSources = this.props.sources.filter(source => sourceIds.includes(source.id));

        if (dataSetSources.length > 0) {
          const rawData = dataSetSources.length === 1 ?
          pathOr(null, ['rawData'], dataSetSources[0]) :
          dataSetSources.reduce((acc, curr) => {
            if (curr.rawData) {
              acc.push(curr.rawData);
            }
            return acc;
          }, []);


          const data = executeOperations(
            rawData,
            dataset,
            sortedOperations,
          );

          this.props.dataSetUpdate(dataset.id, { data: data });
        }
      });
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
    return (
      <React.Fragment>
        {
          this.props.datasets.length > 0 ?
          <React.Fragment>
            {
              this.state.hasCreated ? <Redirect to={`/charts/${this.state.hasCreated.chart.id}/chart/edit-dataset/${this.state.hasCreated.id}`} />
              : <React.Fragment>
                <button className="btn btn-primary" onClick={() =>this.setState({ createChartModalShow: true })}>Create a Dataset</button>
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Data Sources</th>
                      <th>Data Providers</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.datasets.map(dataset => {
                      const dataSources = dataset.sources.reduce((acc, curr) => {
                        return acc += `${curr.name}, `
                      }, '');

                      const providers = dataset.sources.reduce((acc, curr) => {
                        return acc += `${curr.provider}, `
                      }, '');

                      return (
                        <tr key={dataset.id}>
                          <td><Link to={`${this.props.url}/edit-dataset/${dataset.id}`}>{dataset.name}</Link></td>
                          <td>{dataSources}</td>
                          <td>{providers}</td>
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
