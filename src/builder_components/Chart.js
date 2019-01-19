import React from 'react';
import ChartConfig from './ChartConfig';
import ChartRuntime from './ChartRuntime';

const Chart = (props) => {

  return (
    <div className='chart-config'>
      <h2>{props.type}</h2>
      <ChartConfig id={props.id} />
      <ChartRuntime id={props.id} />
    </div>
  );
}

export default Chart;