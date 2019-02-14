import React from 'react';
import Operations from './Operations';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state;
};

const SingleDataSet = ({ dataset }) => {

  return (
    <div className="single-dataset">
      <h5>{dataset.title}</h5>
      <Operations dataSetId={dataset.id} dataSourceId={dataset.sourceId} />
    </div>
  );
}

export default connect(
  mapStateToProps
)(SingleDataSet);