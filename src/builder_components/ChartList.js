import React from 'react';

const ChartList = (props) => {

  return (
    <ul className="navbar-nav mr-auto">
      {props.charts.map(chart => {
        return <li className="nav-item">
          <a className="nav-link" onClick={() => props.onSelect(chart)}
          href="#">
            {chart.name}</a>
        </li>
      })}
    </ul>
  );
}

export default ChartList;