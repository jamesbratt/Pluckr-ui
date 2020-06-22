import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { clone } from 'ramda';
import { executeOperations } from '../../data_parsing/parse';

const DataKeySelector = (props) => {

  const [currentData, setCurrentData] = useState(null);

  useEffect(() => {
    const operations = props.isEdit ? props.operations.filter(operation => operation.sort_order <= props.isEdit.sort_order) : props.operations;
    const data = executeOperations(
      clone(props.dataset.rawData),
      props.dataset,
      operations,
    );

    setCurrentData(data);
  }, [props.dataset]);

  return (
    <></>
  );
}

const mapStateToProps = (state, props) => {
  return {
    dataset: state.datasets.find(dataset => dataset.id === parseInt(props.dataSetId)),
    operations: state.operations.filter(operation => operation.dataset.id === parseInt(props.dataSetId)),
  };
};

export default connect(
  mapStateToProps
)(DataKeySelector);