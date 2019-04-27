import { assoc, assocPath, pathOr } from 'ramda';

const constructSeries = (node, data, ast) => {
  if (Array.isArray(data)) {
    const args = ast.filter(childNode => childNode.parent === node.id);
    const xaxis = args.find(arg => arg.name === 'XAXIS');
    const yaxis = args.find(arg => arg.name === 'YAXIS');

    const xaxisxaxisValue = xaxis.value;
    const yaxisxaxisValue = yaxis.value;

    const dataSortedByXaxis = data.sort((a,b) => {
      return a[xaxisxaxisValue] - b[xaxisxaxisValue];
    });

    return dataSortedByXaxis.map(dataPoint => {
      return {x: dataPoint[xaxisxaxisValue], y: dataPoint[yaxisxaxisValue]};
    })
  }
  throw new Error('CONSTRUCT_SERIES can only be executed on a list of items');
}

const forEvery = (node, data, ast) => {
  if (Array.isArray(data)) {
    const arg = ast.find(childNode => childNode.parent === node.id);
    return data.map(dataPoint => {
      return executeFunction(arg, dataPoint, ast);
    })
  }
  throw new Error('FOR_EVERY can only be executed on a list of items');
}

const target = (node, data, ast) => {
  if ((typeof data === 'function' || (typeof data === 'object' && !!data)) && !Array.isArray(data)) {
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
  throw new Error('TARGET can only be executed on a data structure with keys');
}

const addKey = (node, data, ast) => {
  if ((typeof data === 'function' || (typeof data === 'object' && !!data)) && !Array.isArray(data)) {
    const args = ast.filter(childNode => childNode.parent === node.id);
    const newKey = args.find(arg => arg.name === 'NEW_DATA_KEY');
    const func = args.find(arg => arg.name === 'FUNCTION');
    const newKeyName = newKey.value;

    return assoc(newKeyName, executeFunction(func, data, ast), data);
  }
  throw new Error('ADD_KEY can only be executed on a data structure with keys');
}

const groupBy = (node, data, ast) => {
  if (Array.isArray(data)) {
    const args = ast.filter(childNode => childNode.parent === node.id);
    const keyToGroupBy = args.find(arg => arg.name === 'DATA_KEY');
    const keyToGroupByName = keyToGroupBy.value;

    const groupedData = [];

    data.forEach(item => {
      const existingGroup = groupedData.find(
        group => group[keyToGroupByName] === item[keyToGroupByName]
      );
      if (!existingGroup) {
        const groupObj = {};
        groupObj[keyToGroupByName] = item[keyToGroupByName];
        groupObj['items'] = [item];
        groupedData.push(groupObj);
      } else {
        const groupItems = existingGroup.items;
        groupItems.push(item);
        groupedData.map(group => {
          if (group[keyToGroupByName] === item[keyToGroupByName]) {
            assocPath(['items'], groupItems, group);
          }
        })
      }

    });
    
    return groupedData;
  }
  throw new Error('ADD_KEY can only be executed on a data structure with keys');
}

const pluck = (node, data, ast) => {
  if ((typeof data === 'function' || (typeof data === 'object' && !!data)) && !Array.isArray(data)) {
    const args = ast.filter(childNode => childNode.parent === node.id);
    const target = args.find(arg => arg.name === 'DATA_KEY');
    const keyToTarget = target.value;

    return pathOr(null, [keyToTarget], data);
  }
  throw new Error('PLUCK can only be executed on a data structure with keys');
}

const multiplyBy = (node, data, ast) => {
  if (!isNaN(data)) {
    let dataPoint = data;
    const args = ast.filter(childNode => childNode.parent === node.id);
    const val = args.find(arg => arg.name === 'INTEGER');
    return parseInt(dataPoint) * parseInt(val.value);
  }
  throw new Error('DIVIDE_BY can only be executed on numbers');
}

const divideBy = (node, data, ast) => {
  if (!isNaN(data)) {
    let dataPoint = data;
    const args = ast.filter(childNode => childNode.parent === node.id);
    const val = args.find(arg => arg.name === 'INTEGER');
    return parseInt(dataPoint) / parseInt(val.value);
  }
  throw new Error('MULTIPLY_BY can only be executed on numbers');
}

const add = (node, data, ast) => {
  if (!isNaN(data)) {
    let dataPoint = data;
    const args = ast.filter(childNode => childNode.parent === node.id);
    const val = args.find(arg => arg.name === 'INTEGER');
    return parseInt(dataPoint) + parseInt(val.value);
  }
  throw new Error('ADD can only be executed on numbers');
}

const subtract = (node, data, ast) => {
  if (!isNaN(data)) {
    let dataPoint = data;
    const args = ast.filter(childNode => childNode.parent === node.id);
    const val = args.find(arg => arg.name === 'INTEGER');
    return parseInt(dataPoint) - parseInt(val.value);
  }
  throw new Error('SUBTRACT can only be executed on numbers');
}

const convertToUnixTimestamp = (node, data, ast) => {
  if (!isNaN(Date.parse(data))) {
    const timestamp = new Date(data).getTime();
    return timestamp;
  }
  throw new Error("Invalid date format");
}

const getMonth = (node, data, ast) => {
  const args = ast.filter(childNode => childNode.parent === node.id);
  const dateKey = args.find(arg => arg.name === 'DATA_KEY');
  const dateKeyValue = data[dateKey.value];
  if (!isNaN(Date.parse(dateKeyValue))) {
  
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    const date = new Date(dateKeyValue);
    const monthFromDate = date.getMonth();
    return months[monthFromDate];
  }
  throw new Error("Invalid date format");
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
    case 'GROUP_BY':
      return groupBy(
        node,
        data,
        ast,
      );
    case 'ADD_KEY':
      return addKey(
        node,
        data,
        ast,
      );
    case 'PLUCK':
      return pluck(
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
    case 'CONVERT_TO_TIMESTAMP':
      return convertToUnixTimestamp(
        node,
        data,
        ast,
      );
    case 'GET_MONTH':
      return getMonth(
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

