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

export const addDataset = (id, sourceId, chartId, isActive) => {
  return {
    type: 'ADD_DATASET',
    id,
    sourceId,
    chartId,
    isActive,
  }
};

export const addOperation = (id, dataSetId) => {
  return {
    type: 'ADD_OPERATION',
    id,
    dataSetId,
  }
};