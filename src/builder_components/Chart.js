import React from 'react';
import ChartConfig from './ChartConfig';

const Chart = (props) => {

  return (
    <div className='chart-config'>
      <h2>{props.name}</h2>
      <ChartConfig id={props.id} name={props.name} />
    </div>
  );
}

export default Chart;