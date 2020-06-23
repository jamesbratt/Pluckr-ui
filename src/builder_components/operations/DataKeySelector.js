import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { clone } from 'ramda';
import { executeOperations } from '../../data_parsing/parse';

const DataKeySelector = (props) => {

  let availableKeys = [];
  const [currentData, setCurrentData] = useState(null);

  useEffect(() => {
    const operations = props.isEdit ? props.operations.filter(operation => operation.sort_order <= props.isEdit.sort_order) : props.operations;

    const updatedOperations = operations.map(operation => {
      const ast = [];
      for (let node of operation.ast) {
        if (node.id === props.parent || props.parent === 'root') {
          break
        };
        ast.push(node);
      };

      return {
        ...operation,
        ast,
      }
    });

    const data = executeOperations(
      clone(props.dataset.rawData),
      props.dataset,
      updatedOperations,
    );

    setCurrentData(data);
  }, [props.dataset]);

  if (Array.isArray(currentData)) {
    if ((typeof currentData[0] === 'function' || (typeof currentData[0] === 'object' && !!currentData[0])) && !Array.isArray(currentData[0])) {
      availableKeys = Object.keys(currentData[0]);
    }
  }

  if ((typeof currentData === 'function' || (typeof currentData === 'object' && !!currentData)) && !Array.isArray(currentData)) {
    availableKeys = Object.keys(currentData);
  }

  return (
    <select value={props.value} id={props.id} onChange={props.onChange} className="form-control mb-2 mr-sm-2">
      <option value={null} hidden>-- Select a Data Key --</option>
      {availableKeys.map(key => {
        return <option key={key} value={key}>{key}</option>;
      })}
    </select>
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