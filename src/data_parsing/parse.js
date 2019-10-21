import { assoc, assocPath, pathOr } from 'ramda';

const constructSeries = (node, data, ast) => {
  if (Array.isArray(data)) {
    const args = ast.filter(childNode => childNode.parent === node.id);
    const xaxis = args.find(arg => arg.name === 'XAXIS');
    const yaxis = args.find(arg => arg.name === 'YAXIS');

    const xaxisxaxisValue = xaxis.value;
    const yaxisxaxisValue = yaxis.value;

    /*const dataSortedByXaxis = data.sort((a,b) => {
      return a[xaxisxaxisValue] - b[xaxisxaxisValue];
    });*/

    return data.map(dataPoint => {
      return [dataPoint[xaxisxaxisValue], dataPoint[yaxisxaxisValue]];
    })
  }
  throw new Error('CONSTRUCT_SERIES can only be executed on a list of items');
}

const constructPieSeries = (node, data, ast) => {
  if (Array.isArray(data)) {
    const args = ast.filter(childNode => childNode.parent === node.id);
    const name = args.find(arg => arg.name === 'NAME');
    const value = args.find(arg => arg.name === 'VALUE');

    const valueTotal = data.reduce((acc, current) => {
      return acc + current[value.value];
    }, 0);

    return data.map(dataPoint => {
      const y = (dataPoint[value.value]/valueTotal) * 100;
      return { name: dataPoint[name.value], y };
    })
  }
  throw new Error('CONSTRUCT_PIE_SERIES can only be executed on a list of items');
}

const sortNumericalXaxis = (node, data, ast) => {
  if (Array.isArray(data)) {
    return data.sort((a,b) => {
      return a[0] - b[0];
    });
  }
  throw new Error('SORT_NUMERICAL_XAXIS can only be executed on a list of items');
}

const forEvery = (node, data, ast) => {
  if (Array.isArray(data)) {
    const arg = ast.find(childNode => childNode.parent === node.id);
    return data.map(dataPoint => {
      return executeFunction(arg, dataPoint, ast);
    })
  }
  throw new Error('FOR_EVERY_ITEM can only be executed on a list of items');
}

const target = (node, data, ast) => {
  if ((typeof data === 'function' || (typeof data === 'object' && !!data)) && !Array.isArray(data)) {
    const args = ast.filter(childNode => childNode.parent === node.id);
    const target = args.find(arg => arg.name === 'DATA_KEY');
    const func = args.find(arg => arg.name === 'FUNCTION');
    const keyToTarget = target.value;

    return executeFunction(func, data[keyToTarget], ast);
  }
  throw new Error('TARGET can only be executed on a data structure with keys');
}

const updateKey = (node, data, ast) => {
  if ((typeof data === 'function' || (typeof data === 'object' && !!data)) && !Array.isArray(data)) {
    const args = ast.filter(childNode => childNode.parent === node.id);
    const target = args.find(arg => arg.name === 'DATA_KEY');
    const func = args.find(arg => arg.name === 'FUNCTION');
    const keyToTarget = target.value;

    const newKeyValue = executeFunction(func, data[keyToTarget], ast);
    data[keyToTarget] = newKeyValue;
    return data;
  }
  throw new Error('TARGET can only be executed on a data structure with keys');
}

const targetByIndex = (node, data, ast) => {
  if (Array.isArray(data)) {
    const args = ast.filter(childNode => childNode.parent === node.id);
    const target = args.find(arg => arg.name === 'DATA_INDEX');
    const func = args.find(arg => arg.name === 'FUNCTION');
    const indexToTarget = parseInt(target.value);

    const newIndexValue = executeFunction(func, data[indexToTarget], ast);
    data.splice(indexToTarget, 1, newIndexValue);
    return data;
  }
  throw new Error('TARGET_BY_INDEX can only be executed on a list of items');
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
        groupObj['item_count'] = 1;
        groupedData.push(groupObj);
      } else {
        const groupItems = existingGroup.items;
        groupItems.push(item);
        existingGroup.item_count = groupItems.length;
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

const filterWhere = (node, data, ast) => {
  return data;
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

const convertIsoToUtcDateTime = (node, data, ast) => {
  if (!isNaN(Date.parse(data))) {
    const timestamp = Date.UTC(data).getTime();
    return timestamp;
  }
  throw new Error("Invalid date format");
}

const convertIsoToUtcDate = (node, data, ast) => {
  if (!isNaN(Date.parse(data))) {
    const dateObject = new Date(data);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth();
    const day = dateObject.getDate();

    return Date.UTC(year, month, day);
  }
  throw new Error("Invalid date format");
}

const countItems = (node, data, ast) => {
  if (Array.isArray(data)) {
    return data.length;
  }
  throw new Error('COUNT can only be executed on a list of items');
}

const listReverse = (node, data, ast) => {
  if (Array.isArray(data)) {
    return data.reverse();
  }
  throw new Error('LIST_REVERSE can only be executed on a list of items');
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
    case 'CONSTRUCT_PIE_SERIES':
      return constructPieSeries(
        node,
        data,
        ast
      );
    case 'SORT_NUMERICAL_XAXIS':
      return sortNumericalXaxis(
        node,
        data,
        ast
      );
    case 'FILTER_WHERE':
      return filterWhere(
        node,
        data,
        ast
      );
    case 'FOR_EVERY_ITEM':
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
    case 'UPDATE_KEY':
      return updateKey(
        node,
        data,
        ast,
      );
    case 'TARGET_BY_INDEX':
      return targetByIndex(
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
    case 'CONVERT_ISO_TO_UTC_DATETIME':
      return convertIsoToUtcDateTime(
        node,
        data,
        ast,
      );
    case 'CONVERT_ISO_TO_UTC_DATE':
      return convertIsoToUtcDate(
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
    case 'LIST_REVERSE':
      return listReverse(
        node,
        data,
        ast,
      );
    case 'COUNT':
      return countItems(
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
      value: operation.root_function,
    }
    data = executeFunction(
      rootNode,
      data,
      operation.ast,
    )
  });

  return data;
}

