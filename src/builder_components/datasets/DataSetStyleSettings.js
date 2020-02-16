import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { updateDataSet } from '../../actions/dataset';
import { ChromePicker } from 'react-color';
import { connect } from 'react-redux';

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

class DataSetStyleSettings extends Component {

  constructor(props) {
    super(props)
    this.state = {
      displayColorPicker: false,
      seriesColour: props.datasets.find(datasets => datasets.id === parseInt(props.dataSetId)).color,
    }
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color, event) => {
    this.setState({ seriesColour: color.hex });
    const { api_key, username } = this.props.user;
    this.props.updateDataSet(api_key, username, this.props.dataSetId, [{color: this.state.seriesColour}]);
  }

  render() {
    const popover = {
      position: 'absolute',
      zIndex: '2',
    }
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    }
    return (
      <Row>
        <Col md={4}>
          <>
            <div className="form-group">
              <label>Data Series Colour</label>
              <div className="input-group mb-3">
                <input defaultValue={this.state.seriesColour} type="text" className="form-control" placeholder="Data series colour" aria-label="Data series colour" />
                <div className="input-group-append">
                  <button onClick={ this.handleClick } className="btn btn-outline-secondary" type="button">Pick a Colour</button>
                </div>
              </div>
            </div>
            {
              this.state.displayColorPicker ? <div style={ popover }>
              <div style={ cover } onClick={ this.handleClose }/>
              <ChromePicker color={ this.state.seriesColour } onChangeComplete={ this.handleChange } />
              </div> : null
            }
          </>
        </Col>
      </Row>
    );
  }

}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataSetStyleSettings);