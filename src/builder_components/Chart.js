import React from 'react';
import ChartConfig from './ChartConfig';
import ChartRuntime from './ChartRuntime';

const Chart = (props) => {

  return (
    <div className='chart-config'>
      {props.id}
      <ChartConfig />
      <ChartRuntime />
    </div>
  );
}

export default Chart;