import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import DataProviderTable from '../dataproviders/DataProviderTable';
import { connect } from 'react-redux';
import { fetchCharts } from '../../actions/chart';
import { Redirect } from "react-router-dom";
import { addChart } from '../../actions/chart';
import { addNotification } from '../../actions/notification';

const ICON_MAPPER = {
  line: 'fa fa-line-chart',
  bar: 'fa fa-bar-chart',
  pie: 'fa fa-pie-chart',
};

const mapStateToProps = (state) => {
  return {
    charts: state.charts,
    user: state.user[0],
    loader: state.loader,
  };
};

class TemplateList extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hasInstalled: null,
      }
    }

    componentDidMount() {
      const user = this.props.user.username;
      const apiKey = this.props.user.api_key;
      this.props.dispatch(
        fetchCharts(
          apiKey,
          user,
        )
      );
    }

    install = (chart_id) => {
      const user = this.props.user.username;
      const apiKey = this.props.user.api_key;

      const tokens = localStorage.getItem('token');
      const parsedTokens = tokens ? JSON.parse(tokens) : {};

      const payload = {
        chart_id,
        tokens: parsedTokens,
      };

      fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/library/install/`, {
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
      .then(response => {
        if(!response.error) {
          this.props.dispatch(
            addChart(response.chart)
          );
          this.setState({ hasInstalled: response.chart })
          this.props.dispatch(addNotification({ message: 'Template has successfully been installed', type: 'success' }))
          this.setState({
            hasInstalled: response.chart,
          });
        } else {
          this.props.dispatch(addNotification({ message: response.error.message, type: 'error' }));
        }
      })
      .catch(error => this.props.dispatch(addNotification({ message: error.message, type: 'error' })));
    }

    render() {
      const templates = this.props.charts.filter(chart => chart.is_published);
      return (
        <React.Fragment>
          {
            this.state.hasInstalled ? <Redirect to={`/charts/${this.state.hasInstalled.id}/data-sources`} /> :
              <React.Fragment>
                <h2>Chart Templates</h2>
                <div className="row">
                  <div className="col-md-8">
                  {
                    templates.length === 0 ? <p className="lead">There are no templates available</p> :
                    <Table bordered hover>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Name</th>
                          <th>Chart Type</th>
                          <th>Series Type</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {templates.map((template) => {
                          return (
                            <tr key={template.id}>
                              <td width="40">
                                <i className={ICON_MAPPER[template.series_type]} />
                              </td>
                              <td>{template.name}</td>
                              <td className="capitalize">{template.chart_type}</td>
                              <td className="capitalize">{template.series_type}</td>
                              <td width="40">
                                <button onClick={() => this.install(template.id)} className="btn btn-link table-btn float-right"><i className="fa fa-download" /></button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  }
                  </div>
                  <div className="col-md-4">
                    <DataProviderTable />
                  </div>
                </div>
            </React.Fragment>
          }
        </React.Fragment>
      )
    }
}

export default connect(
  mapStateToProps
)(TemplateList);