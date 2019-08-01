import { clone } from 'ramda';

let chartInstance = null;

export const setChart = (instance) => {
  chartInstance = instance;
};

export const getChart = () => {
  return chartInstance;
};

export const destroyChart = () => {
  chartInstance.destroy();
};

export const addYaxis = (axis) => {
  chartInstance.addAxis(axis);
};

export const updateXaxis = (title, type, isEnabled) => {
  const xAxis = chartInstance.get('master-x-axis');
  xAxis.update({
    title: {
      text: title
    },
    type: type,
    visible: isEnabled,
  });
}

export const updateYaxis = (dataSetId, title, isOpposite, isEnabled) => {
  const yAxisId = `${dataSetId}`;
  const existingYaxis = chartInstance.get(yAxisId);
  const existingSeries = chartInstance.get(dataSetId);

  if(existingYaxis && !isEnabled && existingSeries) {
    existingYaxis.remove();
  }

  if(existingYaxis && isEnabled) {
    existingYaxis.update({
      title: {
        text: title
      },
      opposite: isOpposite,
    });
  }

  if(!existingYaxis && isEnabled && title && existingSeries) {
    const axis = {
      title: {
          text: title,
      },
      opposite: isOpposite,
      id: yAxisId,
    };

    addYaxis(axis);

    existingSeries.update({
      yAxis: yAxisId,
    });
  }
};

export const addDataSeries = (datasetId, title, data, chartType, dataset) => {
  const clonedData = clone(data);
  const existingSeries = chartInstance.get(datasetId);

  if (existingSeries) {
    existingSeries.update({
      name: title,
      data: clonedData,
    });

  } else {
    let yAxisId = null;
    const { y_axis_title, y_axis_enabled, y_axis_is_opposite } = dataset;
  
    if(y_axis_title && y_axis_enabled) {
      yAxisId = `${dataset.id}`;
      const axis = {
        title: {
            text: y_axis_title,
        },
        opposite: y_axis_is_opposite,
        id: yAxisId,
        // gridLineWidth: 0,
        // minorGridLineWidth: 0,
      };
    
      addYaxis(axis);
    }
  
    const newDataSeries = {
      id: datasetId,
      name: title,
      type: chartType,
      data: clonedData,
      yAxis: yAxisId ? yAxisId : 0,
    };

    chartInstance.addSeries(newDataSeries)  
  }
}
