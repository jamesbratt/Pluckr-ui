let operationDataSet = null;

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

const forEvery = (node, data, ast) => {
  const arg = ast.find(childNode => childNode.parent === node.id);
  return data.map(dataPoint => {
    return executeFunction(arg, dataPoint, ast);
  })
}

const multiplyBy = (node, data, ast) => {
  const arg = ast.find(childNode => childNode.parent === node.id);
  return data * parseInt(arg.value);
}

const divideBy = (node, data, ast) => {
  const arg = ast.find(childNode => childNode.parent === node.id);
  return data / parseInt(arg.value);
}

const add = (node, data, ast) => {
  const arg = ast.find(childNode => childNode.parent === node.id);
  return data + parseInt(arg.value);
}

const subtract = (node, data, ast) => {
  const arg = ast.find(childNode => childNode.parent === node.id);
  return data - parseInt(arg.value);
}

const executeFunction = (node, data, ast) => {
  switch (node.value) {
    case 'FILTER_BY':
      return filterByOperation(
        node,
        data,
        ast
      );
    case 'FOR_EVERY':
      return forEvery(
        node,
        data,
        ast,
      );
    case 'MULTIPLY_BY':
      return multiplyBy(
        node,
        data,
        ast,
      );
    case 'DIVIDE_BY':
      return divideBy(
        node,
        data,
        ast,
      );
    case 'ADD':
      return add(
        node,
        data,
        ast,
      );
    case 'SUBTRACT':
      return subtract(
        node,
        data,
        ast,
      );
    default:
      console.error('Something bad has gone wrong');
  }
}

export const executeOperations = (rawData, dataSet, operations) => {
  operationDataSet = dataSet;
  let data = rawData;
  operations.forEach(operation => {
    const rootNode = {
      id: 'root',
      name: 'FUNCTION',
      parent: null,
      value: operation.rootFunction,
    }
    data = executeFunction(
      rootNode,
      data,
      operation.ast,
    )
  });

  return data;
}

