import { ConvertToIso, generateQueryString, getToken, injectParametersIntoEndpoint, proxyRequest } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const GITHUB_URI = 'https://api.github.com';
const INTEGRATION_TYPE = 'github';

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

const getRepoCommits = (params, resource, username, apiKey) => {
  const urlComponents = injectParametersIntoEndpoint(
    GITHUB_RESOURCES.repo_commits.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'repo_commits',
      GITHUB_RESOURCES['repo_commits'].parameters,
    ) : '';
  const url = `${GITHUB_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey);
};

export const getGitHubData = (resource, params, username, apiKey, sourceId = null) => {
  let call;
  switch(resource) {
    case GITHUB_RESOURCES.repo_commits.name:
    call = getRepoCommits;
      break;
  default:
    console.error('Invalid');
    break;
  }
  return call(params, resource, username, apiKey)
  .then(response => {
    return {
      sourceId,
      data: response,
      properties: RESOURCE_PROPERTIES[resource],
    };
  })
};