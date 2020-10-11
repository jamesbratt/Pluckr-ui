import React from 'react';
import Modal from 'react-bootstrap/Modal';

const Welcome = ({ onClose }) => {
  const dontShow = () => {
    localStorage.setItem('seenWelcome', true);
    onClose();
  }
  return (
    <Modal.Body>
      <h1 className="text-center">Welcome</h1>
      <p className="lead text-center">And thank you for choosing to sign up to Pluckr whilst it is in it's beta phase, to become an early adopter of this new insights platform.</p>
      <p className="text-center">Before jumping straight into building charts we would recommend that you take the time to check out the <a rel="noopener noreferrer" target="_blank" href="https://pluckr.io/documentation/">documentation</a>.
      If you find any problems or would just like to ask a question then please feel free to get in contact via email at <a href="mailto:support@pluckr.io">support@pluckr.io</a></p>
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary btn-lg" onClick={dontShow}>Get Started!</button>
      </div>
    </Modal.Body>
  );
}

export default Welcome;