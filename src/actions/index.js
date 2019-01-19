export const addChart = (id, chartType) => {
  return {
    type: 'ADD_CHART',
    id,
    chartType,
  }
};

export const addSource = (chartId, resource, data) => {
  return {
    type: 'ADD_SOURCE',
    chartId,
    resource,
    data,
  }
};