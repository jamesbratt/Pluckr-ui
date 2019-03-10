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
      <div className="col-md-12">
        <h4>Dataset Configuration</h4>
      </div>
      <div className="col-md-6">
        <Operations dataSetId={props.dataset.id} dataSourceId={props.dataset.sourceId} />
      </div>
      <div className="col-md-6">
        <form key={props.dataset.id}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Title</label>
                <input name="title" onKeyUp={props.update} defaultValue={props.dataset.title} type="text" className="form-control" placeholder="Title" />
              </div>
              <div className="form-check">
                <input name="hasYaxis" defaultChecked={props.dataset.hasYaxis} className="form-check-input" type="checkbox" onChange={props.update} />
                <label className="form-check-label">
                  Add a unique Y axis
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="col-md-12">
        <button onClick={props.run} className="btn btn-success float-right">Run Dataset</button>
      </div>
    </div>
  );
}

export default connect(
  mapStateToProps
)(DatasetConfiguration);