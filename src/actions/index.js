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

export const addDataset = (id, sourceId, chartId, property, data, chartType, hasAxis) => {
  return {
    type: 'ADD_DATASET',
    id,
    sourceId,
    chartId,
    property,
    data,
    chartType,
    hasAxis,
  }
};