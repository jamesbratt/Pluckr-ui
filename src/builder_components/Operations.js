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
      rootFunction: null,
      // operationValue: null,
      operationAst: null,
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
        this.state.rootFunction,
        this.state.operationValue,
      )
    );

    this.setState({ show: false });
  }

  onRootFunctionSet = (event) => {
    const rootFunctionType = event.target.value;
    const rootFunctionSyntax = OPERATION_FUNCTIONS.find(fn => fn.name === rootFunctionType);

    const rootFunctionArguments = rootFunctionSyntax.accepts.map(arg => {
      return {
        id: GenerateGuid(),
        name: arg,
        parent: 'root',
        value: null,
      }
    });

    this.setState({
      operationAst: rootFunctionArguments,
      rootFunction: rootFunctionType, 
    })
  }

  onChildFunctionSet = (event) => {

    // The current AST
    const ast = this.state.operationAst;

    // This is captured from the selectboxes html ID (??)
    const selectedFunctionId = event.target.id;

    // e.g FILTER_BY etc etc
    const selectedFunctionValue = event.target.value;

    // Identify the selected functions parent function
    const parentFunction = ast.find(
      currentFn => currentFn.id === selectedFunctionId
    );

    // This is so that if the selected function is changed
    // then all of its's current offspring are cleared out of the AST
    const getRidOfOffspring = (parentId) => {
      ast.forEach((child, index, object) => {
        if (child.parent === parentId) {
          object.splice(index, 1);
          getRidOfOffspring(child.id);
        }
      })
    }

    // Recurively clearing out the offspring
    getRidOfOffspring(parentFunction.id);

    // Now the selected functions value is set
    ast.find(currentFn => {
      if (currentFn.id === selectedFunctionId) {
        currentFn.value = selectedFunctionValue;
      }
    });

    // Find what arguments the selected function accepts
    const newlySelectedFunctionSyntax = OPERATION_FUNCTIONS.find(
      fn => fn.name === selectedFunctionValue
    );

    // Generate new nodes for each argument that selected function accepts
    const newFunctionArguments = newlySelectedFunctionSyntax.accepts.map(arg => {
      return {
        id: GenerateGuid(),
        name: arg,
        parent: parentFunction.id,
        value: null,
      }
    });

    // Add the new nodes to the AST
    const updatedAst = ast.concat(
      newFunctionArguments
    );

    // Put the updated AST into state
    this.setState({
      operationAst: updatedAst,
    });
  }

  render() {
    let astToForm = null;

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

    if (this.state.operationAst) {
      astToForm = this.state.operationAst.map(syntaxNode => {
        switch(syntaxNode.name) {
          case 'FUNCTION':
            return (
              <select id={syntaxNode.id} className="form-control mb-2 mr-sm-2" onChange={this.onChildFunctionSet}>
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
                <label className="sr-only">{syntaxNode.name}</label>
                <input name={syntaxNode.name} type="number" className="form-control mb-2 mr-sm-2" placeholder={syntaxNode.name} />
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
              {astToForm}
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