// export const EASY_OAUTH_REDIRECT = 'https://easyoauth.com/project/login/1';
// export const EASY_OAUTH_AUTH_ENDPOINT = 'https://easyoauth.com/project/authorise/1/';

// export const STRAVA_REDIRECT = 'https://easyoauth.com/project/login/1';
// export const STRAVA_AUTH_ENDPOINT = 'https://easyoauth.com/project/authorise/1/';

// export const GITHUB_REDIRECT = 'https://easyoauth.com/project/login/2';
// export const GITHUB_AUTH_ENDPOINT = 'https://easyoauth.com/project/authorise/2/';

export const SALESFORCE_REDIRECT = 'https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=3MVG9tzQRhEbH_K3xwzvYEwgSPo59l0Wo1d55C46uZyF0V3jd7PrgQ1DKfbV7xhV8I4.zxOvHJMY.qQXKfFz6&redirect_uri='+ process.env.REACT_APP_REDIRECT_URI +'/authenticate/salesforce&scope=full%20refresh_token';
export const GITHUB_REDIRECT = 'https://github.com/login/oauth/authorize?client_id=5e1960289e1bb322b2c6&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI + '/authenticate/github&scope=read,repo';
export const FACEBOOK_REDIRECT = 'https://www.facebook.com/v4.0/dialog/oauth?client_id=383901508907652&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI + '/authenticate/facebook&state=test'

export const OPERATOR_VALUES = {
  EQUAL_TO: 'EQUAL_TO',
  NOT_EQUAL_TO: 'NOT_EQUAL_TO',
  GREATER_THAN: 'GREATER_THAN',
  LESS_THAN: 'LESS_THAN',
  GREATER_THAN_OR_EQUAL_TO: 'GREATER_THAN_OR_EQUAL_TO',
  LESS_THAN_OR_EQUAL_TO: 'LESS_THAN_OR_EQUAL_TO',
};

export const OPERATORS = [
  { label: 'is equal to', value: OPERATOR_VALUES.EQUAL_TO },
  { label: 'is not equal to', value: OPERATOR_VALUES.NOT_EQUAL_TO  },
  { label: 'is greater than', value: OPERATOR_VALUES.GREATER_THAN  },
  { label: 'is less than', value: OPERATOR_VALUES.LESS_THAN  },
  { label: 'is greater than or equal to', value: OPERATOR_VALUES.GREATER_THAN_OR_EQUAL_TO  },
  { label: 'is less than or equal to', value: OPERATOR_VALUES.LESS_THAN_OR_EQUAL_TO  },
];

export const CHART_TYPES = [
  { value: 'line', label: 'Line Chart' },
  { value: 'area', label: 'Area Chart' }
];

export const DATA_TYPES = {
  date: 'date',
  int: 'integer',
  string: 'string',
  list: 'list',
};

export const OPERATION_FUNCTIONS = [
  {
    name: 'CONSTRUCT_SERIES',
    label: 'Construct axis-based Chart Series',
    help: 'Pick keys that will represent the X and Y axis in your chart (applicable to line/bar charts).', 
    accepts: ['XAXIS', 'YAXIS']
  },
  {
    name: 'CONSTRUCT_PIE_SERIES',
    label: 'Construct Pie Chart Series',
    help: 'Pick keys that will represent a pie chart segment, the value of which will be calculated as a percentage of the total numeration value (applicable to pie/donut charts only).', 
    accepts: ['NAME', 'VALUE']
  },
  {
    name: 'FOR_EVERY_ITEM',
    label: 'For Every Item',
    help: 'Iterate over every item in the dataset and perform an operation.', 
    accepts: ['FUNCTION']
  },
  {
    name: 'FILTER_WHERE',
    label: 'Filter Where',
    help: 'Filter based on a condition.', 
    accepts: ['DATA_KEY', 'OPERATOR', 'VALUE_SELECT']
  },
  {
    name: 'TARGET',
    label: 'Target',
    help: 'Specify a key and perform an operation on it. This will return only the result of the operation performed.', 
    accepts: ['DATA_KEY', 'FUNCTION']
  },
  {
    name: 'UPDATE_KEY',
    label: 'Update Key',
    help: 'Specify a key and perform an operation on it to change its value.', 
    accepts: ['DATA_KEY', 'FUNCTION']
  },
  {
    name: 'TARGET_BY_INDEX',
    label: 'Target by Index',
    help: 'Specify an index in a list and perform an operation on it. This will modify the specified index based on the result of the operation.', 
    accepts: ['DATA_INDEX', 'FUNCTION']
  },
  {
    name: 'ADD_KEY',
    label: 'Add Key',
    help: 'Injects a new key into an object the value of which will be what ever the specified operation returns.', 
    accepts: ['NEW_DATA_KEY', 'FUNCTION']
  },
  {
    name: 'GROUP_BY',
    label: 'Group By',
    help: 'Group a list of objects by a specific key.', 
    accepts: ['DATA_KEY']
  },
  {
    name: 'PLUCK',
    label: 'Pluck',
    help: 'Will return the value of the specified key.', 
    accepts: ['DATA_KEY']
  },
  {
    name: 'MULTIPLY_BY',
    label: 'Multiply By',
    help: 'Performs multiplication on a target.', 
    accepts: ['INTEGER']
  },
  {
    name: 'DIVIDE_BY',
    label: 'Divide By',
    help: 'Performs division on a target.',
    accepts: ['INTEGER']
  },
  {
    name: 'ADD',
    label: 'Add',
    help: 'Performs addition on a target.',
    accepts: ['INTEGER']
  },
  {
    name: 'SUBTRACT',
    label: 'Subtract',
    help: 'Performs subtraction on a target.',
    accepts: ['INTEGER']
  },
  {
    name: 'CONVERT_ISO_TO_UTC_DATETIME',
    label: 'Convert ISO to UTC datetime format',
    help: 'Convert a human-readable ISO date (e.g. 2019-10-19T02:35:33Z) to a UTC timestamp representing the date and time. Charts with a time-based x-axis will expect dates to be in this format.',
    accepts: []
  },
  {
    name: 'CONVERT_ISO_TO_UTC_DATE',
    label: 'Convert ISO to UTC date format',
    help: 'Convert a human-readable ISO date (e.g. 2019-10-19T02:35:33Z) to a UTC timestamp representing just the date. Charts with a time-based x-axis will expect dates to be in this format.',
    accepts: []
  },
  {
    name: 'COUNT',
    label: 'Count',
    help: 'Performs a count on a list and returns the result',
    accepts: []
  },
  {
    name: 'LIST_REVERSE',
    label: 'Reverse List',
    help: 'Reverse orders a list of data.',
    accepts: []
  },
  {
    name: 'SORT_NUMERICAL_XAXIS',
    label: 'Sort Numerical X-axis',
    help: 'Sorts a series of [X, Y] data based on ascending order of the X value.',
    accepts: []
  },
  {
    name: 'GET_MONTH',
    label: 'Get Month',
    help: 'Takes a human-readable date and returns the month only.',
    accepts: ['DATA_KEY']
  }
];