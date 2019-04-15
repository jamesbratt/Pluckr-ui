import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';

const ChartList = (props) => {

  return (
    <NavDropdown title="Charts">
      {props.charts.map(chart => {
        return <NavDropdown.Item onClick={() => props.onSelect(chart)}>
          {chart.name}
        </NavDropdown.Item>
      })}
    </NavDropdown>
  );
}

export default ChartList;