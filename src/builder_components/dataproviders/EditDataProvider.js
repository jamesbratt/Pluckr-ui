import React, { useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { fetchProvider } from '../../actions/provider';
import { connect } from 'react-redux';

const providerNameRef = React.createRef();
const swaggerDefRef = React.createRef();
const clientIdRef = React.createRef();
const clientSecretRef = React.createRef();
const apiKeyRef = React.createRef();

const EditDataProvider = ({ provider, securityDefinition, fetchProvider }) => {
    useEffect(() => {
      fetchProvider(provider.id)
    }, []);

    const updateProvider = () => {
      const payload = {
        ...provider,
        name: providerNameRef.current ? providerNameRef.current.value : null,
        swagger_url: swaggerDefRef.current ? swaggerDefRef.current.value : null, 
        client_id: clientIdRef.current ? clientIdRef.current.value : null, 
        client_secret: clientSecretRef.current ? clientSecretRef.current.value : null, 
        api_key: apiKeyRef.current ? apiKeyRef.current.value : null, 
      }
    }

    let fields = null;
    let redirectUri = null;

    if (securityDefinition) {
      switch(securityDefinition.type) {
        case 'oauth2':
          fields = (
            <>
              <div className="form-group">
                <label>Client ID</label>
                <textarea className="form-control" />
              </div>
              <div className="form-group">
                <label>Client Secret</label>
                <textarea className="form-control" />
              </div>
            </>
          )

          redirectUri = (
            <Alert variant='dark'>
              {`In your oauth2 application, set "${process.env.REACT_APP_PLUCKR_API_URI}/oauth2/${provider.id}/" as the redirect URI`}
            </Alert>
          )
          break;

        case 'apiKey':
          fields = (
            <>
              <div className="form-group">
                <label>API Key</label>
                <textarea className="form-control" />
              </div>
            </>
          )
          break;

        default:
          fields = null;
      }
    }

    return (
      <div>
        <div className="form-group">
          <label>Provider Name</label>
          <input value={provider.name} ref={providerNameRef} className="form-control" type="text" placeholder="What is your provider called?" />
        </div>
        <div className="form-group">
          <label>Swagger Definition URL</label>
          <input value={provider.swagger_url} ref={swaggerDefRef} className="form-control" type="text" placeholder="e.g. https://example.com" />
        </div>
        {fields}
        {redirectUri}
        <button onClick={updateProvider} className="btn btn-success">Save Data Provider</button>
      </div>
    );
}

const mapDispatchToProps = { fetchProvider };

export default connect(null, mapDispatchToProps)(EditDataProvider);