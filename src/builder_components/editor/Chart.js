import React, { Component } from 'react';
import axios from "axios";
import ChartTabs from './ChartTabs';
import DataSetDetail from '../datasets/DataSetDetail';
import classNames from 'classnames';
import Modal from 'react-bootstrap/Modal';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import AddDataSet from '../datasets/AddDataSet';
import { providers } from '../../ProviderConstants';
import { executeOperations } from '../../data_parsing/parse';
import { addNotification } from '../../actions/notification';
import { createDataSet, setDataSets } from '../../actions/dataset';
import { addDataSeries, destroyChart, getChart, setChart, defineChartConfig } from './Graph';
import { connect } from 'react-redux';
import { Route, Redirect } from "react-router-dom";

const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

const style = {
  width: '100%',
  height: '400px',
  margin: '0 auto',
};

const fetchDataSets = async (chartId, username, apiKey) => {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `ApiKey ${username}:${apiKey}`
  };

  try {

    const datasets = await axios({
      method: 'GET',
      headers,
      url: `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dataset/?chart=${chartId}`,
    });

    const vizData = datasets.data.objects.map(async (dataset) => {

      const dataSources = dataset.sources;

      const rawData = dataSources.map((source) => {
        const provider = providers.find(provider => provider.provider === source.provider);
        return provider.request(
          source.resource,
          JSON.parse(source.params),
          username,
          apiKey,
          source.id
        ).catch((error) => {});
      });

      return Promise.all(rawData).then(responses => {
        const rawData = responses.length > 1 ? responses.reduce((acc, curr) => {
          acc.push(curr.data);
          return acc;
        }, []) : responses[0].data;

        return { ...dataset, rawData };
      });

    });

    return Promise.all(vizData).then(responses => {
      return responses;
    });

  } catch(error) {

  }
}

const transformData = async (datasets, username, apiKey) => {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `ApiKey ${username}:${apiKey}`
  };

  const transformedData = datasets.map(async (dataset) => {
    const operations = await axios({
      method: 'GET',
      headers,
      url: `${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/operation/?dataset=${dataset.id}`,
    });

    const processedOperations = operations.data.objects.map(operation => {
      return {
        ...operation,
        ast: JSON.parse(operation.ast),
      };
    }).sort(function(a, b) {
      return a.sort_order - b.sort_order;
    });

    try {
      const data = executeOperations(
        dataset.rawData,
        dataset,
        processedOperations,
      );

      return {
        ...dataset,
        data
      };

    } catch(error) {
        console.error(error);
    };
  });

  return Promise.all(transformedData).then(responses => {
    return responses;
  });
}

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
  addNotification,
  setDataSets,
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

    const chartInstance = getChart();

    // This is so that when a dataset
    // gets deleted, the corresponding series gets removed too
    while(chartInstance.series.length > 0 ) {
      chartInstance.series[0].remove();
    }

    chartInstance.redraw();

    // And then everything gets re-drawn
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
          chart,
        );
      }
    })
  }

  getDataSets = async (chartId) => {
    const user = this.props.user.username;
    const apiKey = this.props.user.api_key;
    const datasets = await fetchDataSets(chartId, user, apiKey);
    const processedDatasets = await transformData(datasets, user, apiKey)
    this.props.setDataSets(processedDatasets);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const chart = this.props.charts.find(chart => chart.id === parseInt(id));

    if (chart) {

      const chartConfig = defineChartConfig(chart);
      const chartInstance = Highcharts.chart(
        `chart-${chart.id}`,
        chartConfig
      );

      this.getDataSets(chart.id);
      setChart(chartInstance);
      this.setUpChartData(chart);
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

  componentDidUpdate(prevProps) {
    const { id } = this.props.match.params;
    const chart = this.props.charts.find(chart => chart.id === parseInt(id));
    const datasets = this.props.datasets.filter(dataset => dataset.chart.id === chart.id).sort(function(a, b) {
      return b.data.length - a.data.length;
    });

    const previousDatasets = prevProps.datasets.filter(dataset => dataset.chart.id === chart.id).sort(function(a, b) {
      return b.data.length - a.data.length;
    });

    // We do not want unecessary re-renders of charts
    // as this will cause the svg to get borked
    if(datasets.length != previousDatasets.length) {
      this.setUpChartData(chart);
    }
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
    const dataSetsToDisplay = this.props.datasets.filter(dataset => dataset.chart.id === parseInt(id));

    const overlayClasses = classNames({
      'overlay': true,
      'overlay-hide': dataSetsToDisplay.length > 0,
    });

    return (
      <div className="clearfix">
        <div className="editor-header">
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
          <div className="table-wrapper"><div style={{ ...style }} id={`chart-${id}`} /></div>
        </div>
        {
          dataSetsToDisplay.length > 0 ?
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
