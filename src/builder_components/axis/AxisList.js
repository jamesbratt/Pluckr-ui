import React, {Component} from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import AddAxis from './AddAxis';
import { createAxis } from '../../actions/axis';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    axis: state.axis,
    user: state.user[0],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createAxis: (apiKey, username, title, opposite) => {
      dispatch(createAxis(
        apiKey,
        username,
        title,
        opposite,
      ));
    }
  };
};

class AxisList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
  }

  add = (title, isOpposite) => {
    this.props.createAxis('', '', title, isOpposite);
  }

  render() {
    return (
      <React.Fragment>
        {
          this.props.axis.length > 0 ?
          <React.Fragment>
            <button onClick={() => this.setState({showModal: true})} className="btn btn-primary">Create a Y-axis</button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Opposite</th>
                  <th>GUID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.props.axis.map(axi => {
                  return (
                    <tr>
                      <td>{axi.title.text}</td>
                      <td>{axi.opposite}</td>
                      <td>{axi.id}</td>
                      <td></td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </React.Fragment> :
          <div>
            <h3>Get started by creating a Y-axis</h3>
            <p className="lead">You can assign Y-axis to datasets</p>
            <button onClick={() => this.setState({showModal: true})} className="btn btn-primary">Create a Y-axis</button>
          </div>
        }
        <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})}>
          <Modal.Header closeButton>
            <Modal.Title>Create a New Y-axis</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <AddAxis add={this.add} close={() => this.setState({createChartModalShow: false})} />
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AxisList);