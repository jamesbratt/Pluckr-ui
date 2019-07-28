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

export const addDataSeries = (datasetId, title, data, chartType) => {

  const newDataSeries = {
    id: datasetId,
    name: title,
    type: chartType,
    data: data,
  };

  const existingSeries = chartInstance.get(datasetId);

  if (existingSeries) {
    existingSeries.update({
      name: title,
      data: data,
    });
  } else {
    chartInstance.addSeries(newDataSeries)  
  }
}
