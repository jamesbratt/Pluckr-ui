export const addChart = (id, chartType) => {
  return {
    type: 'ADD_CHART',
    id,
    chartType,
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

export const addDataset = (id, sourceId, chartId, property, data) => {
  return {
    type: 'ADD_DATASET',
    id,
    sourceId,
    chartId,
    property,
    data,
  }
};