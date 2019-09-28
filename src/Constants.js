// export const EASY_OAUTH_REDIRECT = 'https://easyoauth.com/project/login/1';
// export const EASY_OAUTH_AUTH_ENDPOINT = 'https://easyoauth.com/project/authorise/1/';

// export const STRAVA_REDIRECT = 'https://easyoauth.com/project/login/1';
// export const STRAVA_AUTH_ENDPOINT = 'https://easyoauth.com/project/authorise/1/';

// export const GITHUB_REDIRECT = 'https://easyoauth.com/project/login/2';
// export const GITHUB_AUTH_ENDPOINT = 'https://easyoauth.com/project/authorise/2/';

export const SALESFORCE_REDIRECT = 'https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=3MVG9tzQRhEbH_K3xwzvYEwgSPo59l0Wo1d55C46uZyF0V3jd7PrgQ1DKfbV7xhV8I4.zxOvHJMY.qQXKfFz6&redirect_uri='+ process.env.REACT_APP_REDIRECT_URI +'/authenticate/salesforce&scope=full%20refresh_token';
export const GITHUB_REDIRECT = 'https://github.com/login/oauth/authorize?client_id=5e1960289e1bb322b2c6&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI + '/authenticate/github&scope=read,repo';
export const FACEBOOK_REDIRECT = 'https://www.facebook.com/v4.0/dialog/oauth?client_id=383901508907652&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI + '/authenticate/facebook&state=test'

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
    label: 'Construct Chart Series',
    accepts: ['XAXIS', 'YAXIS']
  },
  {
    name: 'FOR_EVERY_ITEM',
    label: 'For Every Item',
    accepts: ['FUNCTION']
  },
  {
    name: 'TARGET',
    label: 'Target',
    accepts: ['DATA_KEY', 'FUNCTION']
  },
  {
    name: 'TARGET_BY_INDEX',
    label: 'Target by Index',
    accepts: ['DATA_INDEX', 'FUNCTION']
  },
  {
    name: 'ADD_KEY',
    label: 'Add Key',
    accepts: ['NEW_DATA_KEY', 'FUNCTION']
  },
  {
    name: 'GROUP_BY',
    label: 'Group By',
    accepts: ['DATA_KEY']
  },
  {
    name: 'PLUCK',
    label: 'Pluck',
    accepts: ['DATA_KEY']
  },
  {
    name: 'MULTIPLY_BY',
    label: 'Multiply By',
    accepts: ['INTEGER']
  },
  {
    name: 'DIVIDE_BY',
    label: 'Divide By',
    accepts: ['INTEGER']
  },
  {
    name: 'ADD',
    label: 'Add',
    accepts: ['INTEGER']
  },
  {
    name: 'SUBTRACT',
    label: 'Subtract',
    accepts: ['INTEGER']
  },
  {
    name: 'CONVERT_TO_TIMESTAMP',
    label: 'Convert to Timestamp',
    accepts: []
  },
  {
    name: 'COUNT',
    label: 'Count',
    accepts: []
  },
  {
    name: 'LIST_REVERSE',
    label: 'Reverse List',
    accepts: []
  },
  {
    name: 'SORT_NUMERICAL_XAXIS',
    label: 'Sort Numerical X-axis',
    accepts: []
  },
  {
    name: 'GET_MONTH',
    label: 'Get Month',
    accepts: ['DATA_KEY']
  }
];