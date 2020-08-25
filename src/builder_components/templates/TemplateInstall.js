import React, { useState } from 'react';
import { connect } from 'react-redux';
import { assoc } from 'ramda';

const TemplateInstall = ({ id, install, template, providers }) => {
  const templateToInstall = template.find(t => t.id === id);
  const providerCount = templateToInstall.providers.length;

  const [ selectedProviders, onProviderSelect ] = useState({});

  const onSelect = (providerId, sourceId) => {
    onProviderSelect(assoc(sourceId, providerId, selectedProviders));
  }

  const onSubmit = () => {
    install(id, selectedProviders, providerCount);
  }

  return (
    <>
    <h3>Data Sources</h3>
    <p>This template uses {providerCount} data source{providerCount > 1 ? 's' : null}.</p>
    <p>
      Each data source must be connected to an appropriate data provider.
      You must ensure that the providers you select map correctly to what each
      respective data source expects, or your installed chart template will not work correctly.
    </p>
    {templateToInstall.providers.map(source =>
      <>
        <dl class="row">
        <dt class="col-sm-3">Data Source Title</dt>
            <dd class="col-sm-9">{source.name}</dd>

          <dt class="col-sm-3">API Title</dt>
            <dd class="col-sm-9">{source.swagger_info.title} - {source.swagger_info.version}</dd>

          <dt class="col-sm-3">Description</dt>
            <dd class="col-sm-9">
            <p>{source.swagger_info.description}</p>
          </dd>

          <dt class="col-sm-3">Data Provider</dt>
            <dd class="col-sm-9">
            <div class="form-group">
              <label>Which data provider would you like to choose?</label>
              <select onChange={(e) => onSelect(e.target.value, source.id)} class="form-control">
                <option value=''>-- Select a Data Provider --</option>
                {providers.map(provider => <option value={provider.id}>{provider.name}</option>)}
              </select>
            </div>
          </dd>
        </dl>
        <hr />
      </>
    )}
    <button className="btn btn-success" onClick={onSubmit}>Install Chart</button>
    </>
  )
}

export default connect(({ template, providers }) => ({ template, providers: providers.providers }))(TemplateInstall);