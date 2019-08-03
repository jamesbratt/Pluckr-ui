import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
    <Row>
      <Col md={4}>
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
      </Col>
    </Row>
  );
}

export default connect(
  mapStateToProps,
)(DataSetSettings);