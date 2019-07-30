import React from 'react';
import { setYaxisToDataSet } from '../editor/Graph';
import { connect } from 'react-redux';

const axisRef = React.createRef();

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    axis: state.axis,
  };
};

const DataSetSettings = (props) => {

  const save = () => {
    setYaxisToDataSet(axisRef.current.value, props.dataSetId);
  }

  return (
    <React.Fragment>
      <div className="form-group">
        <label>Y-axis</label>
        <select ref={axisRef} className="form-control">
          <option value="">-- Select a Y-axis --</option>
          {props.axis.map(axi => {
            return <option key={axi.id} value={axi.id}>{axi.title.text}</option>
          })}
        </select>            
      </div>
      <button className="btn btn-primary my-2 my-sm-0" onClick={save}>Save</button>
    </React.Fragment>
  );
}

export default connect(
  mapStateToProps,
)(DataSetSettings);