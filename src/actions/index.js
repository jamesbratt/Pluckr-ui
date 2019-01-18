export const addChart = (id, chartType) => {
  return {
    type: 'ADD_CHART',
    id,
    chartType,
  }
};

export const addSource = (chartId, resource, filters) => {
  return {
    type: 'ADD_SOURCE',
    chartId,
    resource,
    filters,
  }
};