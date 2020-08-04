import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { fetchProvider, updateDataProvider } from '../../actions/provider';
import { connect } from 'react-redux';
import { append } from 'ramda';

const providerNameRef = React.createRef();
const swaggerDefRef = React.createRef();
const clientIdRef = React.createRef();
const clientSecretRef = React.createRef();
const apiKeyRef = React.createRef();

const EditDataProvider = ({ provider, securityDefinition, fetchProvider, updateDataProvider }) => {
  const [scopes, updateScopes] = useState([]);

  const initialScopes = provider.scopes ? JSON.parse(provider.scopes.replace(/'/g, '"')) : [];

  useEffect(() => {
    updateScopes(initialScopes)
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
      scopes: scopes || scopes.length > 0 ? scopes : null
    }

    updateDataProvider(provider.id, payload);
  }

  const handleScopeChange = (e) => {
    const scopeName = e.target.parentNode.textContent;
    const isChecked = e.target.checked;

    if (isChecked) {
      updateScopes(append(scopeName, scopes));
    }

    if (!isChecked) {
      updateScopes(scopes.filter(s => s !== scopeName));
    }
  }

  let fields = null;
  let redirectUri = null;
  let buttons = [<button style={{ marginRight: '1em' }} onClick={updateProvider} className="btn btn-success">Save Data Provider</button>];

  if (securityDefinition) {
    switch(securityDefinition.type) {
      case 'oauth2':
        fields = (
          <>
            <div className="form-group">
              <label>Client ID</label>
              <textarea defaultValue={provider.client_id} ref={clientIdRef} className="form-control" />
            </div>
            <div className="form-group">
              <label>Client Secret</label>
              <textarea defaultValue={provider.client_secret} ref={clientSecretRef} className="form-control" />
            </div>
            <div className="form-group">
              <label>Permission Scopes</label>
              {Object.keys(securityDefinition.scopes).map(scope => {
                return (
                  <div key={scope} className="form-check">
                    <input defaultChecked={initialScopes.indexOf(scope) > -1 || false} onChange={handleScopeChange} className="form-check-input" type="checkbox" />
                    <label className="form-check-label">
                      {scope}
                    </label>
                  </div>
                )
              })}
            </div>
          </>
        )

        redirectUri = (
          <Alert variant='dark'>
            {`In your oauth2 application, set "${process.env.REACT_APP_PLUCKR_API_URI}/oauth2/${provider.id}/" as the redirect URI`}
          </Alert>
        );

        buttons.push(<a href={`${process.env.REACT_APP_PLUCKR_API_URI}/providers/connect/${provider.id}/`}>Connect to {provider.name}</a>);
        break;

      case 'apiKey':
        fields = (
          <>
            <div className="form-group">
              <label>API Key</label>
              <textarea defaultValue={provider.api_key} ref={apiKeyRef} className="form-control" />
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
        <input defaultValue={provider.name} ref={providerNameRef} className="form-control" type="text" placeholder="What is your provider called?" />
      </div>
      <div className="form-group">
        <label>Swagger Definition URL</label>
        <input defaultValue={provider.swagger_url} ref={swaggerDefRef} className="form-control" type="text" placeholder="e.g. https://example.com" />
      </div>
      {fields}
      {redirectUri}
      {buttons}
    </div>
  );
}

const mapDispatchToProps = { fetchProvider, updateDataProvider };

export default connect(null, mapDispatchToProps)(EditDataProvider);