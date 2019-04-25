import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';

const DataProviderList = (props) => {

  const dataProviders = props.dataProviders.map((dataProvider) => {
    const isActiveStyle = dataProvider.isActive ? 'green' : '#212529';
    return <NavDropdown.Item style={{color: isActiveStyle}} href={dataProvider.redirectUrl}>{dataProvider.provider}</NavDropdown.Item>
  })

  return (
    <NavDropdown title="Data Providers">
      {dataProviders}
    </NavDropdown>
  );
}

export default DataProviderList;