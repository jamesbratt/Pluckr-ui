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
    name: 'CONSTRUCT_SERIES',
    accepts: ['XAXIS', 'YAXIS']
  },
  {
    name: 'FOR_EVERY',
    accepts: ['FUNCTION']
  },
  {
    name: 'TARGET',
    accepts: ['DATA_KEY', 'FUNCTION']
  },
  {
    name: 'MULTIPLY_BY',
    accepts: ['INTEGER']
  },
  {
    name: 'DIVIDE_BY',
    accepts: ['INTEGER']
  },
  {
    name: 'ADD',
    accepts: ['INTEGER']
  },
  {
    name: 'SUBTRACT',
    accepts: ['INTEGER']
  },
  {
    name: 'CONVERT_TO_TIMESTAMP',
    accepts: []
  }
];