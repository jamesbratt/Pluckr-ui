import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import { updateDataProvider } from '../../actions/provider';
import { connect } from 'react-redux';
import { append } from 'ramda';

const providerNameRef = React.createRef();
const swaggerDefRef = React.createRef();
const clientIdRef = React.createRef();
const clientSecretRef = React.createRef();
const apiKeyRef = React.createRef();
const securityOptionRef = React.createRef();
const paramExtensionsRef = React.createRef();
const baseUrlOverrideRef = React.createRef();
const scopeExtensionRef = React.createRef();
const scopeDelimitterRef = React.createRef();

const EditDataProvider = ({ provider, updateDataProvider }) => {
  const [scopes, updateScopes] = useState([]);
  const securityDefinition = provider.swagger_definition;
  const initialScopes = provider.scopes ? JSON.parse(provider.scopes.replace(/'/g, '"')) : [];

  useEffect(() => {
    updateScopes(initialScopes)
  }, []);

  const updateProvider = () => {
    const payload = {
      name: providerNameRef.current ? providerNameRef.current.value : null,
      swagger_url: swaggerDefRef.current ? swaggerDefRef.current.value : null,
      client_id: clientIdRef.current ? clientIdRef.current.value : null,
      client_secret: clientSecretRef.current ? clientSecretRef.current.value : null,
      parameter_extensions: paramExtensionsRef.current ? paramExtensionsRef.current.value : null,
      api_key: apiKeyRef.current ? apiKeyRef.current.value : null,
      security_scheme: securityOptionRef.current ? securityOptionRef.current.value : null,
      api_base_url_override: baseUrlOverrideRef.current ? baseUrlOverrideRef.current.value : null,
      scope_extensions: scopeExtensionRef.current ? scopeExtensionRef.current.value : null,
      scope_delimitter: scopeDelimitterRef.current ? scopeDelimitterRef.current.value : null,
      scopes: scopes || scopes.length > 0 ? scopes : null,
      isEditing: provider.isEditing,
    }

    if (provider.security_scheme) {
      payload.security_scheme = provider.security_scheme;
    };

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
  let advancedFields = null;
  let redirectUri = null;
  let buttons = [<button style={{ marginRight: '1em' }} onClick={updateProvider} className="btn btn-success">Save Data Provider</button>];

  if (securityDefinition) {
    switch(securityDefinition.type) {
      case 'oauth2':
        fields = (
          <>
            <div className="form-group">
              <label>Client ID</label>
              <input type="text" defaultValue={provider.client_id} ref={clientIdRef} className="form-control" />
            </div>
            <div className="form-group">
              <label>Client Secret</label>
              <input type="password" autocomplete="off" defaultValue={provider.client_secret} ref={clientSecretRef} className="form-control" />
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

        advancedFields = (
          <>
            <div className="form-group">
              <label>Scope Delimitter (Optional)</label>
              <input type="text" defaultValue={provider.scope_delimitter} ref={scopeDelimitterRef} className="form-control" />
            </div>
            <div className="form-group">
              <label>Permission Scope Extensions (Optional)</label>
              <textarea defaultValue={provider.scope_extensions} ref={scopeExtensionRef} className="form-control" />
            </div>
            <div className="form-group">
              <label>API Base Url Override (Optional)</label>
              <textarea defaultValue={provider.api_base_url_override} ref={baseUrlOverrideRef} className="form-control" />
            </div>
            <div className="form-group">
              <label>Authentication Parameter Extensions (Optional)</label>
              <textarea defaultValue={provider.parameter_extensions} ref={paramExtensionsRef} className="form-control" />
            </div>
          </>
        )

        redirectUri = (
          <Alert variant='dark'>
            {`In your oauth2 application, set ${process.env.REACT_APP_PLUCKR_API_URI}/providers/authenticate/${provider.id}/ as the redirect/callback URI`}
          </Alert>
        );

        break;

      case 'apiKey':
        fields = (
          <>
            <div className="form-group">
              <label>API Key</label>
              <input type="password" autocomplete="off" defaultValue={provider.api_key} ref={apiKeyRef} className="form-control" />
            </div>
          </>
        )
        break;

      default:
        fields = (
          <Alert variant='danger'>
            The authentication method: {securityDefinition.type} is not valid
          </Alert>
        );
    }
  }

  return (
    <div>
      {provider.security_scheme ?
        <>
          <Tabs defaultActiveKey="basic" id="uncontrolled-tab-example">
            <Tab eventKey="basic" title="Basic Settings">
              {redirectUri}
              <div className="form-group">
                <label>Provider Name</label>
                <input defaultValue={provider.name} ref={providerNameRef} className="form-control" type="text" placeholder="What is your provider called?" />
              </div>
              <div className="form-group">
                <label>Open API Definition URL</label>
                <input defaultValue={provider.swagger_url} ref={swaggerDefRef} className="form-control" type="text" placeholder="e.g. https://example.com" />
              </div>
              {fields}
            </Tab>
            {
              advancedFields ?
                <Tab eventKey="advanced" title="Advanced Settings">
                  {advancedFields}
                </Tab> :
              null
            }
          </Tabs>
          <hr />
          {buttons}
        </> :
        <>
          <div className="form-group">
            <label>Provider Name</label>
            <input defaultValue={provider.name} ref={providerNameRef} className="form-control" type="text" placeholder="What is your provider called?" />
          </div>
          <div className="form-group">
            <label>Open API Definition URL</label>
            <input defaultValue={provider.swagger_url} ref={swaggerDefRef} className="form-control" type="text" placeholder="e.g. https://example.com" />
          </div>
          <div className="form-group">
            <label>Select an authentication method</label>
            <select ref={securityOptionRef} className="form-control">
              <option value={null}>-- Select Method --</option>
              {provider.security_options.map((securityOption) => <option value={securityOption}>{securityOption}</option>)}
            </select>
          </div>
          <button onClick={updateProvider} className="btn btn-success">Continue</button>
        </>
      }
    </div>
  );
}

const mapDispatchToProps = { updateDataProvider };

export default connect(null, mapDispatchToProps)(EditDataProvider);