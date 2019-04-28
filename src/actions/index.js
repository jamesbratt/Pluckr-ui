export const addChart = (id, chartName, chartType) => {
  return {
    type: 'ADD_CHART',
    id,
    chartName,
    chartType,
  }
};

export const updateChartXaxis = (id, axisType) => {
  return {
    type: 'UPDATE_CHART_XAXIS',
    id,
    axisType,
  }
};

export const makeChartActive = (id, isActive) => {
  return {
    type: 'MAKE_CHART_ACTIVE',
    id,
    isActive,
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

export const addDataset = (id, sourceId, chartId, isActive, title, data) => {
  return {
    type: 'ADD_DATASET',
    id,
    sourceId,
    chartId,
    isActive,
    title,
    data,
  }
};

export const makeDatasetActive = (id, isActive) => {
  return {
    type: 'MAKE_DATASET_ACTIVE',
    id,
    isActive,
  }
};

export const updateDatasetYaxis = (id, yaxisId) => {
  return {
    type: 'UPDATE_DATASET_YAXIS',
    id,
    yaxisId,
  }
};

export const runDataset = (datasetId, rawData) => {
  return {
    type: 'RUN_DATASET',
    datasetId,
    rawData
  }
}

export const addOperation = (id, dataSetId, rootFunction, ast) => {
  return {
    type: 'ADD_OPERATION',
    id,
    dataSetId,
    rootFunction,
    ast,
  }
};

export const updateOperation = (id, rootFunction, ast) => {
  return {
    type: 'UPDATE_OPERATION',
    id,
    rootFunction,
    ast,
  }
};

export const setDataProviders = (payload) => {
  return {
    type: 'SET_PROVIDERS',
    payload,
  }
};