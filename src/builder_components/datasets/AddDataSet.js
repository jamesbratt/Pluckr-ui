import React from 'react';
import { createDataSet } from '../../actions';
import { connect } from 'react-redux';

const dataSetNameRef = React.createRef();
const dataSetSourceRef = React.createRef();

const mapStateToProps = (state) => {
  return {
    sources: state.sources.data,
    user: state.user[0],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createDataSet: (apiKey, username, name, chartId, sourceId, data) => {
      dispatch(createDataSet(
        apiKey,
        username,
        name,
        chartId,
        sourceId,
        data,
      ));
    }
  };
};

const AddDataSet = (props) => {

  const add = () => {
    if(dataSetNameRef.current.value && dataSetSourceRef.current.value) {
      const sourceId = dataSetSourceRef.current.value;
      const dataSource = props.sources.find(
        source => source.id === parseInt(sourceId),
      );
      const { api_key, username } = props.user;
  
      props.createDataSet(
        api_key,
        username,
        dataSetNameRef.current.value,
        props.chartId,
        sourceId,
        dataSource.rawData,
      );

    } else {
      alert('Fill out all required dataset fields');
    }
  } 

  return (
    <React.Fragment>
      <div className="form-group">
        <label>Dataset Name</label>
        <input ref={dataSetNameRef} className="form-control" type="text" placeholder="Dataset title" />
      </div>
      <div className="form-group">
        <label>Data Source</label>
        <select ref={dataSetSourceRef} className="form-control">
          <option value={null} hidden>-- Select a data source --</option>
          {props.sources.map(source => {
            if(source.chart === parseInt(props.chartId)) {
              return <option key={source.name} value={source.id}>{source.name}</option>;
            }
          })}
        </select>
      </div>
      <button onClick={add} className="btn btn-primary my-2 my-sm-0" type="submit">New Dataset</button>
    </React.Fragment>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddDataSet);