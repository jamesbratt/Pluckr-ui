import { ConvertToIso, generateQueryString, getToken, injectParametersIntoEndpoint } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const GITHUB_URI = 'https://api.github.com';

export const GITHUB_RESOURCES = {
  repo_commits: {
    endpoint: '/repos/{owner}/{repo}/commits',
    name: 'repo_commits',
    label: 'Repository Commits',
    parameters: [
      { name: 'owner', type: DATA_TYPES.string },
      { name: 'repo', type: DATA_TYPES.string },
      { name: 'author', type: DATA_TYPES.string },
      { name: 'since', type: DATA_TYPES.date, transform: ConvertToIso },
      { name: 'until', type: DATA_TYPES.date, transform: ConvertToIso },
    ]
  },
};

const RESOURCE_PROPERTIES = {
  repo_commits: [
    'url',
    'sha',
    'node_id',
    'html_url',
    'comments_url',
    'commit',
  ],
}

const getRepoCommits = (params) => {
  const urlComponents = injectParametersIntoEndpoint(
    GITHUB_RESOURCES.repo_commits.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const token = getToken('github');
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'repo_commits',
      GITHUB_RESOURCES['repo_commits'].parameters,
    ) : '';

  return fetch(`${GITHUB_URI}${endPoint}${queryString}`, {
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(response => {
    return response.json();
  }).then(response => {
    return response;
  })
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

export const getGitHubData = (resource, params, sourceId = null) => {
  let call;
  switch(resource) {
    case GITHUB_RESOURCES.repo_commits.name:
    call = getRepoCommits;
      break;
  default:
    console.error('Invalid');
    break;
  }
  return call(params)
  .then(response => {
    return {
      sourceId,
      data: response,
      properties: RESOURCE_PROPERTIES[resource],
    };
  })
};