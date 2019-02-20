import { assocPath } from 'ramda';

const constructSeries = (node, data, ast) => {
    /*if (xAxis === 'DATETIME') {
    const dataSortedByDate = rawData.sort((a,b) => {
      return new Date(b.start_date) - new Date(a.start_date);
    });
  
    return dataSortedByDate.map(data => {
      return [new Date(data.start_date).getTime(), data[operation.value]];
    })  
  }*/

  const args = ast.filter(childNode => childNode.parent === node.id);
  const xaxis = args.find(arg => arg.name === 'XAXIS');
  const yaxis = args.find(arg => arg.name === 'YAXIS');

  const xaxisxaxisValue = xaxis.value;
  const yaxisxaxisValue = yaxis.value;

  const dataSortedByXaxis = data.sort((a,b) => {
    return b[xaxisxaxisValue] - a[xaxisxaxisValue];
  });

  return dataSortedByXaxis.map(dataPoint => {
    return {x: dataPoint[xaxisxaxisValue], y: dataPoint[yaxisxaxisValue]};
  })
}

const forEvery = (node, data, ast) => {
  const arg = ast.find(childNode => childNode.parent === node.id);
  return data.map(dataPoint => {
    return executeFunction(arg, dataPoint, ast);
  })
}

const target = (node, data, ast) => {
  const args = ast.filter(childNode => childNode.parent === node.id);
  const target = args.find(arg => arg.name === 'DATA_KEY');
  const func = args.find(arg => arg.name === 'FUNCTION');
  const keyToTarget = target.value;

  return assocPath(
    [keyToTarget],
    executeFunction(func, data[keyToTarget], ast),
    data,
  );
}

const multiplyBy = (node, data, ast) => {
  let dataPoint = data;
  const args = ast.filter(childNode => childNode.parent === node.id);
  const val = args.find(arg => arg.name === 'INTEGER');
  return dataPoint * val.value;
}

const divideBy = (node, data, ast) => {
  let dataPoint = data;
  const args = ast.filter(childNode => childNode.parent === node.id);
  const val = args.find(arg => arg.name === 'INTEGER');
  return dataPoint / val.value;;
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
    case 'CONSTRUCT_SERIES':
      return constructSeries(
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
    case 'TARGET':
      return target(
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

