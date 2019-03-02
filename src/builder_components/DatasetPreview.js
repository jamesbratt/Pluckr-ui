import React from 'react';
import Modal from 'react-bootstrap/Modal';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import { executeOperations } from '../data_parsing/parse';

const mapStateToProps = state => {
  return state
};

const DatasetPreview = (props) => {
  const preview = () => {
    const dataSet = props.datasets.find(dataset => dataset.id === props.dataSetId);
    const operations = props.operations.filter(operation => operation.dataSetId === props.dataSetId);

    const dataSource = props.sources.find(
      source => source.id === props.dataSourceId,
    );

    return executeOperations(
      dataSource.rawData,
      dataSet,
      operations,
    );
  }

  return (
    <React.Fragment>
        <Modal.Header closeButton>
          <Modal.Title>Dataset Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReactJson src={preview()} />
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => props.previewToggle(false)}>
            Back
          </button>
        </Modal.Footer>
    </React.Fragment>
  );
}

export default connect(
  mapStateToProps
)(DatasetPreview);