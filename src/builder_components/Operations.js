import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import OperationConfiguration from './OperationConfiguration';
import DatasetPreview from './DatasetPreview';
import { GenerateGuid } from '../utils/Helpers';
import { addOperation, updateOperation } from '../actions';
import { connect } from 'react-redux';
import { OPERATION_FUNCTIONS } from '../Constants';
import { difference } from 'ramda';

const mapStateToProps = state => {
  return state;
};

class Operations extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      rootFunction: null,
      operationAst: null,
      operationEdit: null,
      preview: false,
    };
  }

  handleClose = () => {
    this.setState({
      show: false,
      operationAst: null,
      rootFunction: null,
      operationEdit: null,
      preview: false,
    });
  }

  handleShow = () => {
    this.setState({ show: true });
  }

  previewToggle = (preview) => {
    this.setState({ preview, show: true });
  }

  addOperation = () => {
    const newOperationId = GenerateGuid();
    this.props.dispatch(
      addOperation(
        newOperationId,
        this.props.dataSetId,
        this.state.rootFunction,
        this.state.operationAst,
      )
    );

    this.setState({
      show: false,
      operationAst: null,
      rootFunction: null,
    });
  }

  updateOperation = () => {
    this.props.dispatch(
      updateOperation(
        this.state.operationEdit.id,
        this.state.rootFunction,
        this.state.operationAst,
      )
    );

    this.setState({
      show: false,
      operationAst: null,
      rootFunction: null,
      operationEdit: null,
    });
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
    const getRidOfOffspring = (ast, parent) => {
      const nodesToRemove = [];
      for(var i in ast) {
          if(ast[i].parent === parent) {
              var children = getRidOfOffspring(ast, ast[i].id)
  
              if(children.length) {
                children.forEach(child => {
                  nodesToRemove.push(child)
                })
              }
              nodesToRemove.push(ast[i])
          }
      }
      return nodesToRemove
    };

    const cleanedAst = difference(
      ast,
      getRidOfOffspring(ast, parentFunction.id)
    );
    
    // Now the selected functions value is set
    cleanedAst.find(currentFn => {
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
    const updatedAst = cleanedAst.concat(
      newFunctionArguments
    );

    // Put the updated AST into state
    this.setState({
      operationAst: updatedAst,
    });
  }

  onAstNodeValueSelected = (event) => {
    const ast = this.state.operationAst;
    const selectedNodeId = event.target.id;
    const selectedNodeValue = event.target.value;

    ast.find(currentFn => {
      if (currentFn.id === selectedNodeId) {
        currentFn.value = selectedNodeValue;
      }
    });

    this.setState({
      operationAst: ast,
    });
  }

  onOperationEdit = (operation) => {
    this.setState({
      operationAst: operation.ast,
      rootFunction: operation.rootFunction,
      operationEdit: operation,
    }, () => {
        this.handleShow();
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
          {operation.rootFunction}
          <button className="btn btn-light btn-sm float-right" onClick={() => this.onOperationEdit(operation)}>Edit</button>
        </li>
      }
    });

    if (this.state.operationAst) {
      astToForm = this.state.operationAst.map(syntaxNode => {
        switch(syntaxNode.name) {
          case 'FUNCTION':
            return (
              <select defaultValue={syntaxNode.value} id={syntaxNode.id} className="form-control mb-2 mr-sm-2" onChange={this.onChildFunctionSet}>
                <option value={null} hidden>-- Select a function --</option>
                {OPERATION_FUNCTIONS.map(opFunc => {
                  return <option value={opFunc.name}>{opFunc.name}</option>;
                })}
              </select>
            );
          case 'PROPERTY':
          case 'XAXIS':
          case 'YAXIS':
            return (
              <select defaultValue={syntaxNode.value} id={syntaxNode.id} onChange={this.onAstNodeValueSelected} className="form-control mb-2 mr-sm-2">
                <option value={null} hidden>-- Select a {syntaxNode.name} --</option>
                {selectedSource.properties.map(property => {
                  return <option value={property}>{property}</option>;
                })}
              </select>
            );
          case 'INTEGER':
          case "DATA_INDEX":
            return (
              <React.Fragment>
                <label className="sr-only">{syntaxNode.name}</label>
                <input defaultValue={syntaxNode.value} id={syntaxNode.id} onKeyUp={this.onAstNodeValueSelected} name={syntaxNode.name} type="number" className="form-control mb-2 mr-sm-2" placeholder={syntaxNode.name} />
              </React.Fragment>
            );
          case "DATA_KEY":
            return (
              <React.Fragment>
                <label className="sr-only">{syntaxNode.name}</label>
                <input defaultValue={syntaxNode.value} id={syntaxNode.id} onKeyUp={this.onAstNodeValueSelected} name={syntaxNode.name} type="text" className="form-control mb-2 mr-sm-2" placeholder={syntaxNode.name} />
              </React.Fragment>
            );
        }
      })
    };

    return (
      <div className="operations">
        <button style={{marginRight: '1em'}} onClick={this.handleShow} type="button" class="btn btn-primary btn-sm">Add Operation</button>
        <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
          {
            this.state.preview ?
            <DatasetPreview
              dataSetId = {this.props.dataSetId}
              dataSourceId = {this.props.dataSourceId}
              previewToggle = {this.previewToggle}
            /> :
            <OperationConfiguration
              form = {astToForm}
              rootFunction = {this.state.rootFunction}
              setRootFunction = {this.onRootFunctionSet}
              isEdit = {this.state.operationEdit}
              close = {this.handleClose}
              create = {this.addOperation}
              update = {this.updateOperation}
              previewToggle = {this.previewToggle}
            />
          }
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