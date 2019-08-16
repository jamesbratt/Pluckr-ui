import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { fetchCharts, deleteChart } from './actions/chart';
import AddChart from './builder_components/AddChart';
import { Link } from "react-router-dom";

const mapStateToProps = state => {
  return state
};

class Charts extends Component {
    constructor(props) {
      super(props);
      this.state = {
        createChartModalShow: false
      }
    }

    componentDidMount() {
      const user = this.props.user[0].username;
      const apiKey = this.props.user[0].api_key;
      this.props.dispatch(
        fetchCharts(
          apiKey,
          user,
        )
      );
    }

    componentDidUpdate(prevProps) {
      if (this.props.charts.length > prevProps.charts.length) {
        this.setState({createChartModalShow: false})
      }
    }

    removeChart = (chartId) => {
      const user = this.props.user[0].username;
      const apiKey = this.props.user[0].api_key;
      this.props.dispatch(
        deleteChart(
          apiKey,
          user,
          chartId,         
        )
      );
    }

    render() {
      return (
        <React.Fragment>
          <div className='row'>
            <div className='col-md-3'>
              <button onClick={() => this.setState({createChartModalShow: true})} className="add-chart-placeholder">
                <p>Create Chart</p>
              </button>
            </div>
            {
              this.props.charts.map((chart) => {
                return (
                  <div key={chart.name} className='col-md-3'>
                    <div className='add-chart-card'>
                      <div className="chart-card-inner">
                        <h3>{chart.name}</h3>
                        <div className="btn-group-fixed">
                          <Link className="btn btn-primary" to={`/charts/${chart.id}/data-sources`}><i className="fa fa-edit" /></Link>
                          <button onClick={() => this.removeChart(chart.id)} type="button" className="btn btn-danger"><i className="fa fa-trash" /></button>
                        </div>
                      </div>
                    </div>
                  </div>                
                )
              })
            }
          </div>
          <Modal show={this.state.createChartModalShow} onHide={() => this.setState({createChartModalShow: false})}>
            <Modal.Header closeButton>
              <Modal.Title>Create a new chart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddChart />
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
        </React.Fragment>
      )
    }
}

export default connect(
  mapStateToProps
)(Charts);