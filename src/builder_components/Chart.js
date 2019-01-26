import React from 'react';
import ChartConfig from './ChartConfig';

const Chart = (props) => {

  return (
    <div className='container-fluid'>
      <h3>{props.name}</h3>
      <ChartConfig id={props.id} name={props.name} />
    </div>
  );
}

export default Chart;