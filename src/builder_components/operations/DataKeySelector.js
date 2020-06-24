import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { clone } from 'ramda';
import { executeOperations } from '../../data_parsing/parse';
import { addNotification } from '../../actions/notification';

const DataKeySelector = (props) => {

  let availableKeys = [];
  const [currentData, setCurrentData] = useState(null);

  useEffect(() => {
    // If we are editing an existing operation then we have some work to do...
    // We effectively need to set a break point at this specific node when
    // executing operations. This yields the correct data keys to list in the selectbox.
    const operations = props.isEdit ? props.operations.map(operation => {

      // If the operation is the one we are editing, then
      // we don't want to use the saved ast... we want the ast that
      // is currently held in state and is changing as the operation is modified
      if (props.isEdit.id === operation.id) {
        return {
          ...operation,
          ast: props.activeAst,
        };
      }
      return operation;

    // We only want to execute operations up until the operation we are currently editing
    // else the only keys available will be what is left after all operations have completed
    }).filter(operation => operation.sort_order < props.isEdit.sort_order) : props.operations;

    // We must get even more granular with what part of the operation gets
    // executed. So we remove all ast entries beyond the parent of this current ast node.
    // Again, this ensures that we have the correct keys available at that exact point in the operation
    const updatedOperations = operations.map(operation => {
      const ast = [];
      for (let node of operation.ast) {
        if (node.id === props.parent) {
          break
        };
        ast.push(node);
      };

      return {
        ...operation,
        ast,
      }
    });

    // Execute operations to the point that this current ast node is hit
    try {
      const data = executeOperations(
        clone(props.dataset.rawData),
        props.dataset,
        updatedOperations,
      );

      setCurrentData(data);
    } catch(error) {
      props.addNotification({ message: error.message, type: 'error' })
    }
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

const mapDispatchToProps = {
  addNotification,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataKeySelector);