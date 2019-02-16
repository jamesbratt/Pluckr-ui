import React from 'react';
import Operations from './Operations';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state;
};

const SingleDataSet = (props) => {
  const operations = props.operations.filter(
    operation => operation.dataSetId === props.dataset.id
  );

  return (
    <div className="single-dataset">
      <h5>{props.dataset.title}</h5>
      <Operations dataSetId={props.dataset.id} dataSourceId={props.dataset.sourceId} />
      {operations.length > 0 ? <button onClick={props.run} className="btn btn-success">Run Dataset</button> : null}
    </div>
  );
}

export default connect(
  mapStateToProps
)(SingleDataSet);