import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { STRAVA_REDIRECT, GITHUB_REDIRECT } from '../Constants';

const DataProviderList = (props) => {

  return (
    <NavDropdown title="Data Providers">
      <NavDropdown.Item style={{color: 'green'}} target="_blank" href={GITHUB_REDIRECT}>Github</NavDropdown.Item>
      <NavDropdown.Item target="_blank" href={STRAVA_REDIRECT}>Strava</NavDropdown.Item>
    </NavDropdown>
  );
}

export default DataProviderList;