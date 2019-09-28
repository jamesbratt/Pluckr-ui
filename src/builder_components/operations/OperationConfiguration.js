import React from 'react';
import { OPERATION_FUNCTIONS } from '../../Constants';
import Modal from 'react-bootstrap/Modal';
import InfoButton from '../InfoButton';

const OperationConfiguration = (props) => {
  return (
    <React.Fragment>
        <Modal.Header closeButton>
          <Modal.Title>Construct an Operation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-inline my-2 my-lg-0">
            <div className="function-wrapper">
              <select defaultValue={props.rootFunction} className="form-control mb-2 mr-sm-2" onChange={props.setRootFunction}>
                <option value={null} hidden>-- Select a function --</option>
                {OPERATION_FUNCTIONS.map(opFunc => {
                  return <option key={opFunc.name} value={opFunc.name}>{opFunc.label}</option>;
                })}
              </select>
              <InfoButton title='test' content='test' />
            </div>
            {props.form}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={props.close}>
            Close
          </button>
          <button className="btn btn-secondary" onClick={() => props.previewToggle(true)}>
            Preview Dataset
          </button>
          <button className="btn btn-primary" onClick={props.isEdit ? props.update : props.create}>
            Save Operation
          </button>
        </Modal.Footer>
    </React.Fragment>
  );
}

export default OperationConfiguration;