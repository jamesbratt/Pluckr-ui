import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import DataProviderTable from '../dataproviders/DataProviderTable';
import Loader from '../../Loader';
import Modal from 'react-bootstrap/Modal';
import TemplateInstall from './TemplateInstall';
import { connect } from 'react-redux';
import { addChart, deleteChart } from '../../actions/chart';
import { setLoader } from '../../actions'
import { addNotification } from '../../actions/notification';
import { fetchTemplates } from '../../actions/template';

const ICON_MAPPER = {
  line: 'fa fa-line-chart',
  column: 'fa fa-bar-chart',
  pie: 'fa fa-pie-chart',
};

const mapStateToProps = (state) => {
  return {
    charts: state.charts,
    templates: state.template,
    user: state.user[0],
    loader: state.loader,
  };
};

const mapDispatchToProps = {
  addNotification,
  setLoader,
  addChart,
  deleteChart,
  fetchTemplates,
}

class TemplateList extends Component {

  state = {
    showModal: false,
    template_id_to_edit: null,
  }

  componentDidMount() {
    const username = this.props.user.username;
    const apiKey = this.props.user.api_key;
    this.props.fetchTemplates(username, apiKey);
  }

  toggleModal = (id) => this.setState({ showModal: !this.state.showModal, template_id_to_edit: !this.state.showModal ? id : null })

  removeChart = (chartId) => {
    const username = this.props.user.username;
    const apiKey = this.props.user.api_key;
    this.props.deleteChart(
      apiKey,
      username,
      chartId,
    );
  }

  install = (chart_id, sourceProviders) => {
    const user = this.props.user.username;
    const apiKey = this.props.user.api_key;

    const tokens = localStorage.getItem('token');
    const parsedTokens = tokens ? JSON.parse(tokens) : {};

    const payload = {
      chart_id,
      sourceProviders,
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
        this.setState({ showModal: false, template_id_to_edit: null })
        this.props.addChart(response.chart);
        this.props.addNotification({ message: `Template has successfully been installed`, type: 'success' });
      } else {
        this.props.addNotification({ message: response.error.message, type: 'error' });
      }
    })
    .catch(error => this.props.addNotification({ message: error.message, type: 'error' }));
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-8">
          <div className="table-wrapper">
            {this.props.loader ? <Loader /> :
            <>
              <div className="table-header"><h2>Chart Templates</h2></div>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Chart Type</th>
                    <th>Published By</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.templates.map((template) => {
                    return (
                      <tr key={template.id}>
                        <td width="40">
                          <i className={ICON_MAPPER[template.series_type]} />
                        </td>
                        <td>{template.name}</td>
                        <td className="capitalize">{template.chart_type}</td>
                        <td>{template.publisher}</td>
                        <td width="40">
                          <button onClick={() =>/*this.install(template.id)*/ this.toggleModal(template.id)} className="btn btn-link table-btn float-right"><i className="fa fa-download" /></button>
                        </td>
                        <td width="40">
                          <button onClick={() => this.removeChart(template.id)} className="btn btn-link table-btn float-right"><i className="fa fa-trash" /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
              {this.props.templates.length === 0 ? <p className="lead">There are no templates available</p> : null}
            </>}
          </div>
        </div>
        <div className="col-md-4">
          <DataProviderTable />
        </div>

        <Modal size="lg" show={this.state.showModal} onHide={this.toggleModal}>
          <Modal.Header closeButton>
            <Modal.Title>Install</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.template_id_to_edit ? <TemplateInstall install={this.install} id={this.state.template_id_to_edit} /> : null}
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateList);