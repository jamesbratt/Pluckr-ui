export const EASY_OAUTH_REDIRECT = 'http://easyoauth.com/project/login/1';
export const EASY_OAUTH_AUTH_ENDPOINT = 'http://easyoauth.com/project/authorise/1/';

export const CHART_TYPES = [
  { value: 'line', label: 'Line Chart' },
  { value: 'area', label: 'Area Chart' }
];

export const DATA_TYPES = {
  date: 'date',
  int: 'integer',
};

export const OPERATION_FUNCTIONS = [
  {
    name: 'FILTER_BY',
    accepts: ['PROPERTY']
  },
  {
    name: 'FOR_EVERY',
    accepts: ['FUNCTION']
  },
  {
    name: 'MULTIPLY_BY',
    accepts: ['INTEGER', 'DATA_INDEX']
  },
  {
    name: 'DIVIDE_BY',
    accepts: ['INTEGER', 'DATA_INDEX']
  },
  {
    name: 'ADD',
    accepts: ['INTEGER', 'DATA_INDEX']
  },
  {
    name: 'SUBTRACT',
    accepts: ['INTEGER', 'DATA_INDEX']
  }
];