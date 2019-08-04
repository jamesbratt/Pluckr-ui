import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { pathOr } from 'ramda';
import { updateDataSet } from '../../actions/dataset';
import { connect } from 'react-redux';

const datasetTitleRef = React.createRef();

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    datasets: state.datasets,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateDataSet: (apiKey, user, datasetId, updates) => {
      dispatch(updateDataSet(
        apiKey,
        user,
        datasetId,
        updates,
      ));
    }
  };
};

const DataSetSettings = (props) => {

  const onChange = () => {
    const title = pathOr(null, ['value'], datasetTitleRef.current);
    const { api_key, username } = props.user;
    props.updateDataSet(api_key, username, props.dataSetId, [{name: title}]);
  }

  const dataset = props.datasets.find(dataset => dataset.id === parseInt(props.dataSetId))

  return (
    <Row>
      <Col md={4}>
        <div className="form-group">
          <label>Dataset Title</label>
          <input onChange={onChange} defaultValue={dataset.name} ref={datasetTitleRef} className="form-control" type="text" placeholder="Chart title" />
        </div>
      </Col>
    </Row>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataSetSettings);