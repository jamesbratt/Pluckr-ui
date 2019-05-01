export const EASY_OAUTH_REDIRECT = 'http://easyoauth.com/project/login/1';
export const EASY_OAUTH_AUTH_ENDPOINT = 'http://easyoauth.com/project/authorise/1/';

export const STRAVA_REDIRECT = 'http://easyoauth.com/project/login/1';
export const STRAVA_AUTH_ENDPOINT = 'http://easyoauth.com/project/authorise/1/';

export const GITHUB_REDIRECT = 'http://easyoauth.com/project/login/2';
export const GITHUB_AUTH_ENDPOINT = 'http://easyoauth.com/project/authorise/2/';

export const CHART_TYPES = [
  { value: 'line', label: 'Line Chart' },
  { value: 'area', label: 'Area Chart' }
];

export const DATA_TYPES = {
  date: 'date',
  int: 'integer',
  string: 'string',
};

export const OPERATION_FUNCTIONS = [
  {
    name: 'CONSTRUCT_SERIES',
    accepts: ['XAXIS', 'YAXIS']
  },
  {
    name: 'FOR_EVERY_ITEM',
    accepts: ['FUNCTION']
  },
  {
    name: 'TARGET',
    accepts: ['DATA_KEY', 'FUNCTION']
  },
  {
    name: 'TARGET_BY_INDEX',
    accepts: ['DATA_INDEX', 'FUNCTION']
  },
  {
    name: 'ADD_KEY',
    accepts: ['NEW_DATA_KEY', 'FUNCTION']
  },
  {
    name: 'GROUP_BY',
    accepts: ['DATA_KEY']
  },
  {
    name: 'PLUCK',
    accepts: ['DATA_KEY']
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
  },
  {
    name: 'COUNT',
    accepts: []
  },
  {
    name: 'LIST_REVERSE',
    accepts: []
  },
  {
    name: 'SORT_NUMERICAL_XAXIS',
    accepts: []
  },
  {
    name: 'GET_MONTH',
    accepts: ['DATA_KEY']
  }
];