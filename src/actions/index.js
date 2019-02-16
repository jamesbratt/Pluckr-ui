export const addChart = (id, chartName) => {
  return {
    type: 'ADD_CHART',
    id,
    chartName,
  }
};

export const addSource = (id, sourceName, chartId, resource, data, properties) => {
  return {
    type: 'ADD_SOURCE',
    id,
    sourceName,
    chartId,
    resource,
    data,
    properties,
  }
};

export const addDataset = (id, sourceId, chartId, isActive, title, xAxis) => {
  return {
    type: 'ADD_DATASET',
    id,
    sourceId,
    chartId,
    isActive,
    title,
    xAxis,
  }
};

export const runDataset = (datasetId, rawData) => {
  return {
    type: 'RUN_DATASET',
    datasetId,
    rawData,
  }
}

export const addOperation = (id, dataSetId, operationFunction, value) => {
  return {
    type: 'ADD_OPERATION',
    id,
    dataSetId,
    operationFunction,
    value,
  }
};