import { getToken } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const GITHUB_URI = 'https://api.github.com';

export const GITHUB_RESOURCES = {
  test: {
    endpoint: '/',
    name: 'test',
    label: 'test',
    parameters: [
      { name: 'test', type: DATA_TYPES.int },
    ]
  },
};

export const getUser = () => {
  const token = getToken('github');
  return fetch(`${GITHUB_URI}/user`, {
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `token ${token}`
    }
  }).then(response => {
    return { provider: 'github', status: response.status };
  });
};

export const getGitHubData = (resource) => {
  let call;
  switch(resource) {
    case GITHUB_RESOURCES.test.name:
      call = null;
      break;
  default:
    console.error('Invalid');
    break;
  }
  return call;
};