import React from 'react';
import ChartConfig from './ChartConfig';

const Chart = (props) => {

  return (
    <div className='container-fluid wrapper'>
      <h3>{props.name}</h3>
      <ChartConfig id={props.id} name={props.name} />
    </div>
  );
}

export default Chart;