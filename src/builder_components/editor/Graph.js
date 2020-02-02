import { assocPath, clone } from 'ramda';

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

export const updateXaxis = (updates) => {
  const xAxis = chartInstance.get('master-x-axis');
  xAxis.update({
    title: {
      text: updates.x_axis_title,
    },
    type: updates.chart_type,
    visible: updates.x_axis_enabled,
  });
}

export const updateChartInstance = (updates) => {
  let chartUpdates = updates;
  if (updates.name) {
    const title = updates.name;
    delete chartUpdates.name;
    chartUpdates = assocPath(['title'], { text: title }, updates);
  }

  if (updates.background_color) {
    const backgroundColor = updates.background_color;
    delete chartUpdates.background_color;
    chartUpdates = assocPath(['chart'], { backgroundColor: backgroundColor }, updates);
  }

  chartInstance.update(chartUpdates);
}

export const updateDataSeries = (dataSetId, updates) => {
  let seriesUpdates = updates;
  if (updates.name) {
    const title = updates.name;
    delete seriesUpdates.name;
    seriesUpdates = assocPath(['title'], { text: title }, updates);
  }
  const existingSeries = chartInstance.get(dataSetId);
  existingSeries.update(updates);
}

export const updateChartColour = (payload) => {

  chartInstance.update({
    title: {
      style: {
          color: payload.color
      }
    },
  })

  chartInstance.legend.update({
    itemStyle: {
      color: payload.color
    },
  })

  chartInstance.yAxis.forEach(yAxis => {
    yAxis.update({
      labels: {
        style: {
            color: payload.color
        }
      },
      title: yAxis.userOptions.title ? {
        style: {
            color: payload.color
        }
      } : false,
      lineColor: payload.color,
      tickColor: payload.color,
    });
  });

  const xAxis = chartInstance.get('master-x-axis');
  xAxis.update({
    labels: {
      style: {
          color: payload.color
      }
    },
    title: {
      style: {
          color: payload.color
      }
    },
    lineColor: payload.color,
    tickColor: payload.color,
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
      gridLineWidth: 0,
      minorGridLineWidth: 0,
    };

    addYaxis(axis);

    existingSeries.update({
      yAxis: yAxisId,
    });
  }
};

export const addDataSeries = (datasetId, title, data, chartType, dataset, chart = null) => {
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
            style: {
              color: chart.color
          }
        },
        opposite: y_axis_is_opposite,
        id: yAxisId,
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        labels: {
          style: {
              color: chart.color
          }
        },
        lineColor: chart.color,
        tickColor: chart.color,
      };

      addYaxis(axis);
    }

    const newDataSeries = {
      id: datasetId,
      name: title,
      type: chartType,
      data: clonedData,
      color: dataset.color ? dataset.color : null,
      yAxis: yAxisId ? yAxisId : 0,
    };

    chartInstance.addSeries(newDataSeries)
  }
}
