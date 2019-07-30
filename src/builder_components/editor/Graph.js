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

export const setYaxisToDataSet = (YaxisId, datasetId) => {
  const existingSeries = chartInstance.get(parseInt(datasetId));
  if (existingSeries) {
    if(!YaxisId) {
      existingSeries.update({
        yAxis: 0,
      });
    } else {
      existingSeries.update({
        yAxis: YaxisId,
      });
    }
  }
};

export const addDataSeries = (datasetId, title, data, chartType) => {

  const clonedData = clone(data);

  const newDataSeries = {
    id: datasetId,
    name: title,
    type: chartType,
    data: clonedData,
  };

  const existingSeries = chartInstance.get(datasetId);

  if (existingSeries) {
    existingSeries.update({
      name: title,
      data: clonedData,
    });
  } else {
    chartInstance.addSeries(newDataSeries)  
  }
}
