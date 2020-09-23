import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';

import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    user: state.user[0],
    loader: state.loader,
  };
};

class DeleteAccount extends React.Component {
  state = {
    showModal: false,
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  deleteAccount = () => {
    const username = this.props.user.username;
    const apiKey = this.props.user.api_key;
    const userId = this.props.user.id;
    fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/user/${userId}/`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${apiKey}`
      },
    })
      .then(response => {
        if (response.status === 204) {
          Cookies.remove('pluckr_token');
          window.location.href = "/";
        }
      })
  }

  render() {
    return (
      <div className="table-wrapper">
          <>
            <h2>Account page for {this.props.user.username}</h2>
            <p style={{ marginBottom: '0' }}>Not feeling Pluckr? Then you can completely delete your account if you like.</p>
            <p>All your charts and data provider connections will be permanently deleted.</p>
            <div className="table-header">
              <button onClick={this.toggleModal} className="btn btn-danger">Delete Account</button>
            </div>
          </>
          <Modal show={this.state.showModal} onHide={this.toggleModal}>
            <Modal.Header closeButton>
              <Modal.Title>Are you sure you want to delete your account?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <button onClick={this.deleteAccount} className="btn btn-danger">Yup, I'm sure!</button>
              <button style={{ marginLeft: '1em' }} onClick={this.toggleModal} className="btn btn-secondary">Cancel</button>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps)(DeleteAccount);
