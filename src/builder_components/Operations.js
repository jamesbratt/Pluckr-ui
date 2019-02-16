import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import { GenerateGuid } from '../utils/Helpers';
import { addOperation } from '../actions';
import { connect } from 'react-redux';
import { OPERATION_FUNCTIONS } from '../Constants';

const mapStateToProps = state => {
  return state;
};

class Operations extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      operationFunction: null,
      // operationValue: null,
      functionArguments: null,
    };
  }

  handleClose = () => {
    this.setState({ show: false });
  }

  handleShow = () => {
    this.setState({ show: true });
  }

  addOperation = () => {
    const newOperationId = GenerateGuid();
    this.props.dispatch(
      addOperation(
        newOperationId,
        this.props.dataSetId,
        this.state.operationFunction,
        this.state.operationValue,
      )
    );

    this.setState({ show: false });
  }

  onRootFunctionSet = (event) => {
    const operationFunctionName = event.target.value;
    const functionConfig = OPERATION_FUNCTIONS.find(fn => fn.name === operationFunctionName);

    const functionArguments = functionConfig.accepts.map(arg => {
      return {
        id: GenerateGuid(),
        name: arg,
        parent: 'root',
      }
    });

    this.setState({
      functionArguments,
      operationFunction: operationFunctionName, 
    })
  }

  onOperationChildFunctionSet = (event) => {
    const currentFunctionArgs = this.state.functionArguments;
    const operationFunctionId = event.target.id;

    const parent = currentFunctionArgs.find(
      currentFn => currentFn.id === operationFunctionId
    );

    const getRidOfOffspring = (parentId) => {
      currentFunctionArgs.forEach((child, index, object) => {
        if (child.parent === parentId) {
          object.splice(index, 1);
          getRidOfOffspring(child.id);
        }
      })
    }

    getRidOfOffspring(parent.id);

    const functionConfig = OPERATION_FUNCTIONS.find(
      fn => fn.name === event.target.value
    );

    const newFunctionArguments = functionConfig.accepts.map(arg => {
      return {
        id: GenerateGuid(),
        name: arg,
        parent: parent.id,
      }
    });

    const appendedFunctionArgs = currentFunctionArgs.concat(
      newFunctionArguments
    );

    this.setState({
      functionArguments: appendedFunctionArgs,
    });
  }

  render() {
    let functionArguments = null;

    const selectedSource = this.props.sources.find(
      source => source.id === this.props.dataSourceId
    );

    const operations = this.props.operations.map(operation => {
      if (operation.dataSetId === this.props.dataSetId) {
        return <li class="list-group-item">
          {operation.operationFunction}
        </li>
      }
    });

    if (this.state.functionArguments) {
      functionArguments = this.state.functionArguments.map(functionArgument => {
        switch(functionArgument.name) {
          case 'FUNCTION':
            return (
              <select id={functionArgument.id} className="form-control mb-2 mr-sm-2" onChange={this.onOperationChildFunctionSet}>
                <option value={null} hidden>-- Select a function --</option>
                {OPERATION_FUNCTIONS.map(opFunc => {
                  return <option value={opFunc.name}>{opFunc.name}</option>;
                })}
              </select>
            );
          case 'PROPERTY':
            return (
              <select className="form-control mb-2 mr-sm-2">
                <option value={null} hidden>-- Select a value --</option>
                {selectedSource.properties.map(property => {
                  return <option value={property}>{property}</option>;
                })}
              </select>
            );
          case 'INTEGER':
            return (
              <React.Fragment>
                <label className="sr-only">{functionArgument.name}</label>
                <input name={functionArgument.name} type="number" className="form-control mb-2 mr-sm-2" placeholder={functionArgument.name} />
              </React.Fragment>
            );
        }
      })
    };

    return (
      <div className="operations">
        <button onClick={this.handleShow} type="button" class="btn btn-primary btn-sm">Add Operation</button>
        <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Construct an Operation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-inline my-2 my-lg-0">
              <select className="form-control mb-2 mr-sm-2" onChange={this.onRootFunctionSet}>
                <option value={null} hidden>-- Select a function --</option>
                {OPERATION_FUNCTIONS.map(opFunc => {
                  return <option value={opFunc.name}>{opFunc.name}</option>;
                })}
              </select>
              {functionArguments}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={this.handleClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={this.addOperation}>
              Save Operation
            </button>
          </Modal.Footer>
        </Modal>
        <ul class="list-group operations">
          {operations}
        </ul>
      </div>
    );

  }
}

export default connect(
  mapStateToProps
)(Operations);