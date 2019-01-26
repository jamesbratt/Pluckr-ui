import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';

const ChartList = (props) => {

  return (
    <NavDropdown title="Edit Charts" id="basic-nav-dropdown">
      {props.charts.map(chart => {
        return <NavDropdown.Item
          onClick={() => props.onSelect({id: chart.id, name: chart.name})}
          href="#">
            {chart.name}
        </NavDropdown.Item>
      })}
    </NavDropdown>
  );
}

export default ChartList;