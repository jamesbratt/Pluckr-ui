import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import { GenerateGuid } from '../utils/Helpers';
import { addOperation } from '../actions';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state;
};

class Operations extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
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
      )
    );

    this.setState({ show: false });
  }

  render() {
    const selectedSource = this.props.sources.find(
      source => source.id === this.props.dataSourceId
    );

    const operations = this.props.operations.map(operation => {
      if (operation.dataSetId === this.props.dataSetId) {
        return <li class="list-group-item">
          {operation.id}
        </li>
      }
    });
  
    return (
      <div className="operations">
        <button onClick={this.handleShow} type="button" class="btn btn-primary btn-sm">Add Operation</button>
        <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Construct an Operation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-inline my-2 my-lg-0">
              <select className="form-control mr-sm-2">
                <option value={null} hidden>-- Select a function --</option>
                <option>Filter</option>
                <option>Sum</option>
              </select>
              <select className="form-control mr-sm-2">
                <option value={null} hidden>-- Select a criteria --</option>
                <option>By</option>
                <option>Where</option>
              </select>
              <select className="form-control mr-sm-2">
                <option value={null} hidden>-- Select a value --</option>
                {selectedSource.properties.map(property => {
                  return <option>{property}</option>;
                })}
              </select>
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