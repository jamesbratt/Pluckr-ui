import React, { Component } from 'react';
import Chart from './builder_components/Chart';
import { GenerateGuid } from './utils/Helpers';
import { EASY_OAUTH_REDIRECT } from './Constants';
import { addChart } from './actions';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state
};

class Builder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectChartName: null,
      chartToEdit: null,
    };
  }

  addChart = (event) => {
    event.preventDefault();
    if(this.state.selectChartName) {
      this.props.dispatch(
        addChart(
          GenerateGuid(),
          this.state.selectChartName
        )
      );
    } else {
      alert('Fill out all required chart fields');
    }
  }

  selectChartName = (event) => {
    this.setState({selectChartName: event.target.value});
  }

  selectChartToEdit = (chart) => {
    this.setState({chartToEdit: chart});
  }

  componentDidMount() {
    const stravaToken = localStorage.getItem('token');
    if(!stravaToken) {
      document.location.replace(EASY_OAUTH_REDIRECT);
    }
  }

  render() {
    return (
      <div id='chart-canvas'>
        <h1>Chart Configurations</h1>
        <form onSubmit={this.addChart}>
          <input type="text" onKeyUp={this.selectChartName} />
          <button>Add Chart</button>
        </form>
        <div>
          <ul>
            {this.props.charts.map(chart => {
              return <li><button onClick={() => this.selectChartToEdit({id: chart.id, name: chart.name})}>{chart.name}</button></li>;
            })}
          </ul>
        </div>
        {this.state.chartToEdit ? <Chart id={this.state.chartToEdit.id} name={this.state.chartToEdit.name} /> : null}
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(Builder);
