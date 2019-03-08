import React from 'react';
import Operations from './Operations';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state;
};

const DatasetConfiguration = (props) => {
  const operations = props.operations.filter(
    operation => operation.dataSetId === props.dataset.id
  );

  return (
    <div className="row">
      <div className="col-md-6">
        <Operations dataSetId={props.dataset.id} dataSourceId={props.dataset.sourceId} />
        <button onClick={props.run} className="btn btn-success">Run Dataset</button>
      </div>
      <div className="col-md-6">
        <form>
          <div className="row">
            <div className="col-md-4">
              <div className="form-check">
                <input defaultChecked={true} className="form-check-input" type="checkbox" onChange={props.updateYaxis} />
                <label className="form-check-label">
                  Add a unique Y axis
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default connect(
  mapStateToProps
)(DatasetConfiguration);