import React, { useEffect } from 'react';
import { connect } from 'react-redux';

const providerNameRef = React.createRef();
const swaggerDefRef = React.createRef();

const EditDataProvider = () => {
    useEffect(() => {});
    return (
      <div>
        <div className="form-group">
          <label>Provider Name</label>
          <input ref={providerNameRef} className="form-control" type="text" placeholder="What is your provider called?" />
        </div>
        <div className="form-group">
          <label>Swagger Definition URL</label>
          <input ref={swaggerDefRef} className="form-control" type="text" placeholder="e.g. https://example.com" />
        </div>
        <div className="form-group">
          <label>Client ID</label>
          <textarea className="form-control" />
        </div>
        <div className="form-group">
          <label>Client Secret</label>
          <textarea className="form-control" />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input className="form-control" type="text" />
        </div>
        <div className="form-group">
          <label>API Key</label>
          <textarea className="form-control" />
        </div>
        <button className="btn btn-success">Save Data Provider</button>
      </div>
    );
}

const mapStateToProps = ({ dataProviders }) => ({ dataProviders })

export default connect(mapStateToProps)(EditDataProvider);