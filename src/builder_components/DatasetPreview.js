import React from 'react';
import Modal from 'react-bootstrap/Modal';
import JSONTree from 'react-json-tree'
import { connect } from 'react-redux';
import { executeOperations } from '../data_parsing/parse';

const mapStateToProps = state => {
  return state
};

const DatasetPreview = (props) => {

  let data = [];

  try {
    const dataSet = props.datasets.find(dataset => dataset.id === props.dataSetId);
    const operations = props.operations.filter(operation => operation.dataSetId === props.dataSetId);
  
    const dataSource = props.sources.find(
      source => source.id === props.dataSourceId,
    );
  
    data = executeOperations(
      dataSource.rawData,
      dataSet,
      operations,
    );

  } catch (error) {
    alert(error);
  } 


  return (
    <React.Fragment>
        <Modal.Header closeButton>
          <Modal.Title>Dataset Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="preview-wrapper">
            <JSONTree data={data} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => props.previewToggle(false)}>
            Construct Operation
          </button>
        </Modal.Footer>
    </React.Fragment>
  );
}

export default connect(
  mapStateToProps
)(DatasetPreview);