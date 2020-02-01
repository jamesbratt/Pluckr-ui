import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { updateChartColour } from './Graph';
import { updateChart } from '../../actions/chart';
import { ChromePicker } from 'react-color';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    charts: state.charts,
  };
};

const mapDispatchToProps = {
  updateChart
};

class ChartStyleSettings extends Component {

  constructor(props) {
    super(props)
    this.state = {
      displayColorPicker: {
        background_color: false,
        font_color: false,
        axis_color: false,
      },
      backgroundColour: props.charts.find(chart => chart.id === parseInt(props.chartId)).background_color,
      fontColour: props.charts.find(chart => chart.id === parseInt(props.chartId)).font_color,
      axis_color: '',
    }
  }

  handleClick = (input) => {
    const foo = !this.state.displayColorPicker[input];

    switch(input) {
      case 'background_color':
        this.setState({
          displayColorPicker: {
            background_color: foo,
          }
        });
        break;
      case 'font_color':
        this.setState({
          displayColorPicker: {
            font_color: foo,
          }
        });
        break;
      case 'axis_color':
        this.setState({
          displayColorPicker: {
            axis_color: foo,
          }
        });
        break;
      default:
        break;
    }
  };

  handleClose = () => {
    this.setState({ displayColorPicker: {
      background_color: false,
      font_color: false,
      axis_color: false,
    }})
  };

  handleBackgroundChange = (color, event) => {
    this.setState({ backgroundColour: color.hex });
    const { api_key, username } = this.props.user;
    this.props.updateChart(api_key, username, this.props.chartId, [{background_color: this.state.backgroundColour}]);
  }

  handleFontChange = (color, event) => {
    this.setState({ fontColour: color.hex });
    const { api_key, username } = this.props.user;
    this.props.updateChart(
      api_key,
      username,
      this.props.chartId,
      [{font_color: this.state.fontColour}],
      updateChartColour,
    );
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
              <label>Background Colour</label>
              <div className="input-group mb-3">
                <input defaultValue={this.state.backgroundColour} type="text" className="form-control" placeholder="Background colour" aria-label="Background colour" />
                <div className="input-group-append">
                  <button onClick={() => this.handleClick('background_color')} className="btn btn-outline-secondary" type="button">Pick a Colour</button>
                </div>
              </div>
            </div>
              {
                this.state.displayColorPicker.background_color ? <div style={ popover }>
                <div style={ cover } onClick={ this.handleClose }/>
                <ChromePicker color={ this.state.backgroundColour } onChangeComplete={ this.handleBackgroundChange } />
                </div> : null
              }
          </>
          <>
            <div className="form-group">
              <label>Font Colour</label>
              <div className="input-group mb-3">
                <input defaultValue={this.state.fontColour} type="text" className="form-control" placeholder="Font colour" aria-label="Font colour" />
                <div className="input-group-append">
                  <button onClick={() => this.handleClick('font_color')} className="btn btn-outline-secondary" type="button">Pick a Colour</button>
                </div>
              </div>
            </div>
              {
                this.state.displayColorPicker.font_color ? <div style={ popover }>
                <div style={ cover } onClick={ this.handleClose }/>
                <ChromePicker color={ this.state.fontColour } onChangeComplete={ this.handleFontChange } />
                </div> : null
              }
          </>
          <>
            <div className="form-group">
              <label>Axis Colour</label>
              <div className="input-group mb-3">
                <input defaultValue={this.state.axis_color} type="text" className="form-control" placeholder="Axis colour" aria-label="Axis colour" />
                <div className="input-group-append">
                  <button onClick={() => this.handleClick('axis_color')} className="btn btn-outline-secondary" type="button">Pick a Colour</button>
                </div>
              </div>
            </div>
              {
                this.state.displayColorPicker.axis_color ? <div style={ popover }>
                <div style={ cover } onClick={ this.handleClose }/>
                <ChromePicker color={ this.state.axis_color } onChangeComplete={ this.handleChange } />
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
)(ChartStyleSettings);