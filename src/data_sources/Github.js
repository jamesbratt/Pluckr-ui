import { getToken } from '../utils/Helpers';

const GITHUB_URI = 'https://api.github.com';

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