import React from 'react';
import { connect } from 'react-redux';

const providerNameRef = React.createRef();
const swaggerDefRef = React.createRef();

const CreateDataProvider = ({create}) => {
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
        <button onClick={() => create(providerNameRef.current.value, swaggerDefRef.current.value)} className="btn btn-success">Create Data Provider</button>
      </div>
    );
}

const mapStateToProps = ({ dataProviders }) => ({ dataProviders })

export default connect(mapStateToProps)(CreateDataProvider);