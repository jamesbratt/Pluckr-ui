const filterByOperation = (xAxis, rawData, operation) => {
  if (xAxis === 'DATETIME') {
    const dataSortedByDate = rawData.sort((a,b) => {
      return new Date(b.start_date) - new Date(a.start_date);
    });
  
    return dataSortedByDate.map(data => {
      return [new Date(data.start_date).getTime(), data[operation.value]];
    })  
  }

  return rawData.map(data => {
    return [data[operation.value]];
  })
}

export const executeOperations = (rawData, dataSet, operations) => {
  let data = rawData;
  operations.forEach(operation => {
    switch (operation.operationFunction) {
      case 'FILTER_BY':
        data = filterByOperation(
          dataSet.xAxis,
          data,
          operation
        );
        break;
      default:
        console.error('Something bad has gone wrong');
    }
  });

  return data;
}