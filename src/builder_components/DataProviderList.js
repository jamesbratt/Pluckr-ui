import React from 'react';

const DataProviderList = (props) => {

  const dataProviders = props.dataProviders.map((dataProvider) => {
    return (
      <div className="provider-grid-item">
        <a href={dataProvider.redirectUrl}>
          <img height={75} src={dataProvider.icon} alt={dataProvider.provider} />
          <h5>{dataProvider.provider}</h5>
        </a>
      </div>
    );
  })

  return (
    <div className="provider-grid">
      {dataProviders}
    </div>
  );
}

export default DataProviderList;