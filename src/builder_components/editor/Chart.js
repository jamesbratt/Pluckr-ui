import React, { Component } from 'react';
import ChartTabs from './ChartTabs';
import DataSetDetail from '../datasets/DataSetDetail';
import classNames from 'classnames';
import Modal from 'react-bootstrap/Modal';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import AddDataSet from '../datasets/AddDataSet';
import { addNotification } from '../../actions/notification';
import { createDataSet, fetchDatasets } from '../../actions/dataset';
import { addDataSeries, destroyChart, getChart, setChart } from './Graph';
import { connect } from 'react-redux';
import { Route, Redirect } from "react-router-dom";

const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

const style = {
  width: '100%',
  height: '400px',
  margin: '0 auto',
};

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    datasets: state.datasets,
    charts: state.charts,
    sources: state.sources.data,
  };
};

const mapDispatchToProps = {
  createDataSet,
  fetchDatasets,
  addNotification,
};

class Chart extends Component {

  constructor(props) {
    super(props);
    this.chartInstance = getChart();
    this.state = {
      createChartModalShow: false,
      hasCreated: null,
    }
  }

  addDataset = (name, chartId, sourceId, rawData) => {

    const { api_key, username } = this.props.user;

    this.props.createDataSet(
      api_key,
      username,
      name,
      chartId,
      sourceId,
      rawData,
    ).then((response) => {
      this.setState({
        createChartModalShow: false,
        hasCreated: response,
      }, () => {
        this.setState({
          hasCreated: null,
        })
      });
    });
  }

  setUpChartData = (chart) => {
    const datasets = this.props.datasets.sort(function(a, b) {
      return b.data.length - a.data.length;
    });

    datasets.forEach((dataset) => {
      if(dataset.chart.id === chart.id) {
        addDataSeries(
          dataset.id,
          dataset.name,
          dataset.data,
          chart.series_type,
          dataset,
        );
      }
    })
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const chart = this.props.charts.find(chart => chart.id === parseInt(id));

    if (chart) {
      const chartConfig = {
        title: {
          text: chart.name,
          type: chart.series_type
        },
        chart: {
          backgroundColor: chart.background_color ? chart.background_color : null
        },
        legend: {
          align: 'left',
          verticalAlign: 'top',
        },
        exporting: {
          buttons: {
            contextButton: {
              enabled: false
            },
          }
        }
      };

      if (chart.chart_type !== 'pie') {
        chartConfig['xAxis'] = {
          type: chart.chart_type,
          id: 'master-x-axis',
          visible: chart.x_axis_enabled,
          title: {
            text: chart.x_axis_title,
          }
        };

        chartConfig['yAxis'] = {
          title: false,
          gridLineWidth: 0,
          minorGridLineWidth: 0,
        };
      } else {
        chartConfig['tooltip'] = {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        };

        chartConfig['plotOptions'] = {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              },
              showInLegend: true
          }
        };
      }

      const chartInstance = Highcharts.chart(
        `chart-${chart.id}`,
        chartConfig
      );

      setChart(chartInstance);
      const { api_key, username } = this.props.user;
      this.props.fetchDatasets(
        api_key,
        username,
        chart.id,
      );
    }

  }

  download = (type) => {
    const chart = getChart();
    chart.exportChart({
      type,
      filename: chart.title.textStr
    });
  }

  print = () => {
    const chart = getChart();
    chart.print();
  }

  publish = (chart_id) => {
    const user = this.props.user.username;
    const apiKey = this.props.user.api_key;

    const payload = {
      chart_id,
    };

    fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/library/publish/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${user}:${apiKey}`
      },
      body: JSON.stringify(payload)
    })
    .then((response) => {
      return response.json();
    })
    .then(() => {
      this.props.addNotification(
        { message: 'Chart has been successfully published to the template library', type: 'success' }
      );
    })
    .catch(error => this.props.addNotification({ message: error.message, type: 'error' }));
  }

  componentDidUpdate() {
    const { id } = this.props.match.params;
    const chart = this.props.charts.find(chart => chart.id === parseInt(id));
    this.setUpChartData(chart);
  }

  componentWillUnmount() {
    const { id } = this.props.match.params;
    const chart = this.props.charts.find(chart => chart.id === parseInt(id));

    if (chart) {
      destroyChart();
    }
  }

  render() {

    const { id } = this.props.match.params;
    const chart = this.props.charts.find(chart => chart.id === parseInt(id));

    const overlayClasses = classNames({
      'overlay': true,
      'overlay-hide': this.props.datasets.length > 0,
    });

    return (
      <div className="clearfix">
        {chart ? <h2 style={{ display: 'inline-block' }}>{chart.name}</h2> : null}
        <div className="float-right export-btns">
          <button onClick={() => this.publish(id)} className="btn btn-success">Publish as Template</button>
          <button onClick={this.print} className="btn btn-secondary">Print</button>
          <DropdownButton alignRight id="dropdown-item-button" title="Download">
            <Dropdown.Item onClick={() => this.download('image/png')} as="button">Download as PNG image</Dropdown.Item>
            <Dropdown.Item onClick={() => this.download('image/jpeg')} as="button">Download as JPEG image</Dropdown.Item>
            <Dropdown.Item onClick={() => this.download('application/pdf')} as="button">Download as PDF file</Dropdown.Item>
            <Dropdown.Item onClick={() => this.download('image/svg+xml')} as="button">Download as SVG vector image</Dropdown.Item>
          </DropdownButton>
        </div>
        <div style={{position: 'relative', marginBottom: '1em'}}>
          <div className={overlayClasses}>
            <div className="overlay-text">
              <div className="overlay-text-inner">
                <p>Start building your chart by adding a dataset</p>
                <button className="btn btn-primary" onClick={() =>this.setState({ createChartModalShow: true })}>Create a Dataset</button>
              </div>
            </div>
          </div>
          <div style={{ ...style }} id={`chart-${id}`} />
        </div>
        {
          this.props.datasets.length > 0 ?
            <>
              <Route
                exact
                path={this.props.match.path}
                render={() => <ChartTabs chartId={this.props.match.params.id} url={this.props.match.url} />}
              />
              <Route path={`${this.props.match.path}/edit-dataset/:dataset_id`} component={DataSetDetail} />
            </> : null
        }
        {this.state.hasCreated ? <Redirect to={`/charts/${this.state.hasCreated.chart.id}/chart/edit-dataset/${this.state.hasCreated.id}`} /> : null}
        <Modal show={this.state.createChartModalShow} onHide={() => this.setState({createChartModalShow: false})}>
          <Modal.Header closeButton>
            <Modal.Title>Create a New Dataset</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <AddDataSet add={this.addDataset} chartId={this.props.match.params.id} close={() => this.setState({createChartModalShow: false})} />
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </div>
    )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chart);
