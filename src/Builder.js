import React, { Component } from 'react';
import Chart from './builder_components/Chart';
import AddChart from './builder_components/AddChart';
import ChartList from './builder_components/ChartList';
import DataProviderList from './builder_components/DataProviderList';
import { connect } from 'react-redux';
import { makeChartActive, setDataProviders } from './actions';
import './css/builder.css';

const mapStateToProps = state => {
  return state
};

class Builder extends Component {

  selectChartToEdit = (chart) => {
    this.props.dispatch(
      makeChartActive(
        chart.id,
        true,
      )
    );
  }

  componentDidMount() {
    const pings = this.props.dataProviders.map(
      dataProvider => dataProvider.ping()
    );

    Promise.all(pings).then(responses => { 
      this.props.dispatch(
        setDataProviders(
          responses
        )
      );
    });
  }

  render() {
    const chartToEdit = this.props.charts.find(chart => chart.isActive === true);
    return (
      <div id='chart-canvas'>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">Chart Builder</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <DataProviderList dataProviders={this.props.dataProviders} />
            </ul>
          </div>
        </nav>
        <div className='container-fluid wrapper'>
          {!chartToEdit ?
            <div className="add-chart-center-outer">
              <div className="add-chart-center">
                <h1>Build a New Chart</h1>
                <AddChart />
              </div>
            </div>
          : null}
          {chartToEdit ? <Chart id={chartToEdit.id} name={chartToEdit.name} chartConfig={chartToEdit} /> : null}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(Builder);
