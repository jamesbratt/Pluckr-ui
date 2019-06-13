import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { fetchCharts } from './actions';
import AddChart from './builder_components/AddChart';

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
      if (this.props.charts.length > prevProps.charts.length)
        this.setState({createChartModalShow: false})
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
                  <div className='col-md-3'>
                    <div className='add-chart-card'>
                      <h3>{chart.name}</h3>
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