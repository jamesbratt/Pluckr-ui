import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { updateChartInstance } from '../../builder_components/editor/Graph';
import { pathOr } from 'ramda';
import { ChromePicker } from 'react-color';
import { connect } from 'react-redux';

const chartTitleRef = React.createRef();

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    charts: state.charts,
  };
};

const mapDispatchToProps = (dispatch) => {};

class ChartStyleSettings extends Component {

  constructor(props) {
    super(props)
    this.state = {
      displayColorPicker: false,
      backgroundColour: '#FFFFFF',
    }
  }

  save = () => {
    const title = pathOr(null, ['value'], chartTitleRef.current);
    const { api_key, username } = this.props.user;
    updateChartInstance([{backgroundColor: this.state.backgroundColour}]);
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color, event) => {
    this.setState({ backgroundColour: color.hex });
    updateChartInstance({chart: { backgroundColor: this.state.backgroundColour}});
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
        <div class="form-group">
          <label>Background Colour</label>
          <div class="input-group mb-3">
            <input value={this.state.backgroundColour} type="text" class="form-control" placeholder="Background colour" aria-label="Background colour" />
            <div class="input-group-append">
              <button onClick={ this.handleClick } class="btn btn-outline-secondary" type="button">Pick a Colour</button>
            </div>
          </div>
        </div>
          {
            this.state.displayColorPicker ? <div style={ popover }>
            <div style={ cover } onClick={ this.handleClose }/>
            <ChromePicker color={ this.state.backgroundColour } onChangeComplete={ this.handleChange } />
            </div> : null
          }
        </Col>
      </Row>
    );
  }

}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartStyleSettings);