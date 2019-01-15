import React from 'react';

const ChartConfig = (props) => {
  return (
    <div>
      <select>
        <option value={0}>-- Select a Chart --</option>
        <option value={1}>Line Chart</option>
        <option value={2}>Bar Chart</option>
      </select>

      <button>Add a Data Source</button>
      <button>Add a Data Set</button>
    </div>

  );
}

export default ChartConfig;