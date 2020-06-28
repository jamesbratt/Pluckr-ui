import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import OperationConfiguration from './OperationConfiguration';
import DatasetPreview from '../DatasetPreview';
import InfoButton from '../InfoButton';
import ValueSelector from './ValueSelector';
import DataKeySelector from './DataKeySelector';
import { GenerateGuid } from '../../utils/Helpers';
import { createOperation, deleteOperation, updateOperationAst, fetchOperations } from '../../actions';
import { runDataSet } from '../../actions/dataset';
import { connect } from 'react-redux';
import { OPERATION_FUNCTIONS, OPERATORS, MATH_SYMBOLS } from '../../Constants';
import { difference } from 'ramda';
import { addDataSeries } from '../editor/Graph';

const mapStateToProps = (state) => {
  return {
    sources: state.sources.data,
    charts: state.charts,
    operations: state.operations,
    user: state.user[0],
  };
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
    const { operations } = this.props;
    const datasetOperations = operations.filter(operation => operation.dataset.id === parseInt(this.props.dataSetId));
    const chart = this.props.charts.find(chart => chart.id === this.props.chartId);
    const { api_key, username } = this.props.user;
    const sortOrder = datasetOperations.length > 0 ? datasetOperations[datasetOperations.length-1].sort_order + 1 : 0;
    this.props.dispatch(
      createOperation(
        api_key,
        username,
        this.props.dataSetId,
        this.state.rootFunction,
        this.state.operationAst,
        sortOrder,
      )).then(() => {
        this.props.dispatch(
          runDataSet(
            parseInt(this.props.dataSetId),
            addDataSeries,
            chart.series_type,
          )
        )
     });

    this.setState({
      show: false,
      operationAst: null,
      rootFunction: null,
    });
  }

  updateOperation = () => {
    const { api_key, username } = this.props.user;
    const chart = this.props.charts.find(chart => chart.id === this.props.chartId);
    this.props.dispatch(
      updateOperationAst(
        api_key,
        username,
        this.state.operationEdit.id,
        this.state.rootFunction,
        this.state.operationAst,
      )
    ).then(() => {
      this.props.dispatch(
        runDataSet(
          parseInt(this.props.dataSetId),
          addDataSeries,
          chart.series_type,
        )
      )
   });

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

  onAstNodeValueSelected = (event, type = null) => {
    const ast = this.state.operationAst;
    const selectedNodeId = event.target.id;
    const selectedNodeValue = type ? { value: event.target.value, type } : event.target.value;

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
      rootFunction: operation.root_function,
      operationEdit: operation,
    }, () => {
        this.handleShow();
    });
  }

  deleteOperation = (id) => {
    const { api_key, username } = this.props.user;
    this.props.dispatch(
      deleteOperation(
        api_key,
        username,
        id,
      )
    ).then(() => {
      this.props.dispatch(
        runDataSet(
          parseInt(this.props.dataSetId),
          () => {},
          '',
        )
      )
   });
  }

  componentDidMount() {
    const { api_key, username } = this.props.user;
    this.props.dispatch(
      fetchOperations(
        api_key,
        username,
        this.props.dataSetId,
      )
    );
  }

  render() {
    let astToForm = null;

    const selectedSource = this.props.sources.find(
      source => source.id === this.props.dataSourceId
    );

    const operations = this.props.operations.map(operation => {
      if (operation.dataset.id === parseInt(this.props.dataSetId)) {
        return <li key={operation.id} className="list-group-item">
          <button className="btn btn-link btn-sm table-btn" onClick={() => this.onOperationEdit(operation)}>{OPERATION_FUNCTIONS.find(func => operation.root_function === func.name).label}</button>
          <div key={operation.id} className="operation-actions float-right">
            <button style={{ marginLeft: '1em' }} className="btn btn-sm btn-link table-btn" onClick={() => this.deleteOperation(operation.id)}><i className="fa fa-trash" /></button>
          </div>
        </li>
      }
    });

    if (this.state.operationAst) {
      astToForm = this.state.operationAst.map(syntaxNode => {
        switch(syntaxNode.name) {
          case 'FUNCTION':
            return (
              <div className="function-wrapper">
                <select key={syntaxNode.id} defaultValue={syntaxNode.value} id={syntaxNode.id} className="form-control mb-2 mr-sm-2" onChange={this.onChildFunctionSet}>
                  <option value={null} hidden>-- Select a function --</option>
                  {OPERATION_FUNCTIONS.map(opFunc => {
                    return <option key={opFunc.name} value={opFunc.name}>{opFunc.label}</option>;
                  })}
                </select>
                {syntaxNode.value ? <InfoButton title={OPERATION_FUNCTIONS.find(func => syntaxNode.value === func.name).label} content={OPERATION_FUNCTIONS.find(func => syntaxNode.value === func.name).help} /> : null}
              </div>
            );
          case 'OPERATOR':
            return (
              <select key={syntaxNode.id} defaultValue={syntaxNode.value} id={syntaxNode.id} onChange={this.onAstNodeValueSelected} className="form-control mb-2 mr-sm-2">
                <option value={null} hidden>-- Select an Operator --</option>
                {OPERATORS.map(operator => {
                  return <option key={operator.value} value={operator.value}>{operator.label}</option>;
                })}
              </select>
            );
          case 'SYMBOL':
            return (
              <select key={syntaxNode.id} defaultValue={syntaxNode.value} id={syntaxNode.id} onChange={this.onAstNodeValueSelected} className="form-control mb-2 mr-sm-2">
                <option value={null} hidden>-- Select a Symbol --</option>
                {MATH_SYMBOLS.map(operator => {
                  return <option key={operator.value} value={operator.value}>{operator.label}</option>;
                })}
              </select>
            );
          case 'VALUE_SELECT':
            return (
              <ValueSelector value={syntaxNode.value} onChange={this.onAstNodeValueSelected} id={syntaxNode.id} />
            );
          case 'INTEGER':
          case "DATA_INDEX":
            return (
              <React.Fragment key={syntaxNode.id}>
                <label className="sr-only">{syntaxNode.name}</label>
                <input defaultValue={syntaxNode.value} id={syntaxNode.id} onKeyUp={this.onAstNodeValueSelected} name={syntaxNode.name} type="number" className="form-control mb-2 mr-sm-2" placeholder={syntaxNode.name} />
              </React.Fragment>
            );
          case "DATA_KEY":
          case 'XAXIS':
          case 'YAXIS':
          case 'PIE_VALUE':
          case 'NAME':
            return (
              <DataKeySelector
                value={syntaxNode.value}
                onChange={this.onAstNodeValueSelected}
                id={syntaxNode.id}
                isEdit = {this.state.operationEdit}
                dataSetId = {this.props.dataSetId}
                parent={syntaxNode.parent}
                activeAst={this.state.operationAst}
              />
            );
          case "NEW_DATA_KEY":
          case 'VALUE':
            return (
              <React.Fragment key={syntaxNode.id}>
                <label className="sr-only">{syntaxNode.name}</label>
                <input defaultValue={syntaxNode.value} id={syntaxNode.id} onKeyUp={this.onAstNodeValueSelected} name={syntaxNode.name} type="text" className="form-control mb-2 mr-sm-2" placeholder={syntaxNode.name} />
              </React.Fragment>
            );
          default:
            return <></>
        }
      })
    };

    return (
      <div className="operations">
        <button style={{marginRight: '1em'}} onClick={this.handleShow} type="button" className="btn btn-primary btn-sm">Add Operation</button>
        <Modal dialogClassName="modal-80w" show={this.state.show} onHide={this.handleClose}>
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
        <ul className="list-group operations">
          {operations}
        </ul>
      </div>
    );

  }
}

export default connect(
  mapStateToProps
)(Operations);