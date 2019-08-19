import React from 'react';
import DataProviderList from '../DataProviderList';

const GetStarted = ({ providers }) => {

  return (
    <div className="row get-started">
      <div className="col-xl-4 offset-xl-4">
        <h2>Welcome to Pluckr!</h2>
        <p className="lead">To start building a chart, you must first connect to a data provider.</p>
        <DataProviderList dataProviders={providers} />
      </div>
    </div>
  );
}

export default GetStarted;