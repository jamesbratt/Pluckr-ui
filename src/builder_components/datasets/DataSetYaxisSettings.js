import React from 'react';
import { updateDatasetYaxis } from '../../actions/dataset';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';

const axisTitleRef = React.createRef();
const axisDisplayRef = React.createRef();
const axisIsEnabledRef = React.createRef();

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateDatasetYaxis: (apiKey, username, dataSetId, title, isOpposite, isEnabled) => {
      dispatch(updateDatasetYaxis(
        apiKey,
        username,
        dataSetId,
        title,
        isOpposite,
        isEnabled,
      ));
    }
  };
};

const DataSetYaxisSettings = (props) => {

  const save = () => {
    const { api_key, username } = props.user;
    const title = pathOr(null, ['value'], axisTitleRef.current);
    const isOpposite = pathOr(null, ['checked'], axisDisplayRef.current);
    const isEnabled = pathOr(null, ['checked'], axisIsEnabledRef.current);

    props.updateDatasetYaxis(
      api_key,
      username,
      props.dataset.id,
      title,
      isOpposite,
      isEnabled,
    )
  }

  return (
    <React.Fragment>
      <div class="form-group form-check">
        <input ref={axisIsEnabledRef} type="checkbox" class="form-check-input" name="axis-display" defaultChecked={props.dataset.y_axis_enabled} />
        <label class="form-check-label">Enable Y-axis</label>
      </div>
      <div className="form-group">
        <label>Axis Title</label>
        <input ref={axisTitleRef} className="form-control" type="text" placeholder="Y-axis title" defaultValue={props.dataset.y_axis_title} />
      </div>
      <div class="form-group form-check">
        <input ref={axisDisplayRef} type="checkbox" class="form-check-input" name="axis-display" defaultChecked={props.dataset.y_axis_is_opposite} />
        <label class="form-check-label">Display to right of chart</label>
      </div>
      <button className="btn btn-primary my-2 my-sm-0" onClick={save}>Save</button>
    </React.Fragment>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataSetYaxisSettings);