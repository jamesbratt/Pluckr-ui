import React, { Component } from 'react';
import { ChromePicker } from 'react-color';
import { append, clone } from 'ramda';
import { updateChartColourRange } from './Graph';
import { connect } from 'react-redux';
import { updateChart } from '../../actions/chart';

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    charts: state.charts,
  };
};

const mapDispatchToProps = {
  updateChart,
}

class PieChartColourSettings extends Component {
  constructor(props) {
    super(props)
    const initialColours = props.charts.find(chart => chart.id === parseInt(props.chartId)).color_range;
    this.state = {
      colours: initialColours ? initialColours.split(',') : [],
      displayColorPicker: false,
      selectedColour: '#000000',
    }
  }

  update = (colours) => {
    const { api_key, username } = this.props.user;

    this.props.updateChart(
      api_key,
      username,
      this.props.chartId,
      [{color_range: colours.join(', ')}],
      updateChartColourRange,
    );
  }

  handleChange = (color, event) => {
    this.setState({ selectedColour: color.hex });
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  addColour = () => {
    const colours = append(this.state.selectedColour, this.state.colours);
    this.setState({colours});
    this.update(colours);
  }

  removeColour = (i) => {
    const colours = clone(this.state.colours);
    colours.splice(i, 1);
    this.setState({colours});
    this.update(colours);
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
      <>
        <div className="form-group">
          <label>Pie Chart Colour Range</label>
          <div className="input-group mb-3">
            <input value={this.state.selectedColour} onClick={this.handleClick} type="text" className="form-control" placeholder="" aria-label="" />
            <div className="input-group-append">
              <button onClick={this.addColour} className="btn btn-outline-secondary" type="button">Add to Colour Range</button>
            </div>
          </div>
          {this.state.displayColorPicker ? <div style={popover}>
            <div style={cover} onClick={this.handleClose}/>
            <ChromePicker color={this.state.selectedColour} onChangeComplete={this.handleChange} />
          </div> : null}
        </div>
        <ul className="list-group">
          {this.state.colours.map((colour, i) => {
              return <li key={i} className="list-group-item">{colour}<button onClick={() => this.removeColour(i)} className="btn btn-sm btn-danger float-right">Remove</button></li>
          })}
        </ul>
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PieChartColourSettings);