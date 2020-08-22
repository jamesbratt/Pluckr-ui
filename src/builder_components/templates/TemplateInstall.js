import React from 'react';
import { connect } from 'react-redux';

const TemplateInstall = ({ id, template, providers }) => {
  const templateToInstall = template.find(t => t.id === id);
  const providerCount = templateToInstall.providers.length;

  return (
    <>
    <p>This template uses {providerCount} data source{providerCount > 1 ? 's' : null}.</p>
    <p>
      Each data source must be connected to the appropriate data provider.
      You must ensure that the providers you select map correctly to what each
      respective data source expects or your installed template will not work correctly.
    </p>
    {templateToInstall.providers.map(source =>
      <>
        <label>Data Provider to connect to the data source named {source.name}</label>
        <select>
          {providers.map(provider => <option>{provider.name}</option>)}
        </select>
      </>
    )}
    </>
  )
}

export default connect(({ template, providers }) => ({ template, providers: providers.providers }))(TemplateInstall);