import { ConvertToIso, generateQueryString, getToken, injectParametersIntoEndpoint, proxyRequest } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const GITHUB_URI = 'https://api.github.com';
const INTEGRATION_TYPE = 'github';

export const GITHUB_RESOURCES = {
  repos: {
    endpoint: '/user/repos',
    name: 'repos',
    label: 'User Repositories',
    parameters: [
      { name: 'visibility', type: DATA_TYPES.string },
      { name: 'affiliation', type: DATA_TYPES.string },
      { name: 'type', type: DATA_TYPES.string },
      { name: 'sort', type: DATA_TYPES.string },
      { name: 'direction', type: DATA_TYPES.string },
    ]
  },
  repo_contributors: {
    endpoint: '/repos/{owner}/{repo}/contributors',
    name: 'repo_contributors',
    label: 'Repository Contributors',
    parameters: [
      { name: 'owner', type: DATA_TYPES.string },
      { name: 'repo', type: DATA_TYPES.string },
    ]
  },
  repo_commits: {
    endpoint: '/repos/{owner}/{repo}/commits',
    name: 'repo_commits',
    label: 'Repository Commits',
    parameters: [
      { name: 'owner', type: DATA_TYPES.string },
      { name: 'repo', type: DATA_TYPES.string },
      { name: 'author', type: DATA_TYPES.string },
      { name: 'since', type: DATA_TYPES.date, transform: ConvertToIso, useVariables: true },
      { name: 'until', type: DATA_TYPES.date, transform: ConvertToIso, useVariables: false },
    ]
  },
  repo_issues: {
    endpoint: '/repos/{owner}/{repo}/issues',
    name: 'repo_issues',
    label: 'Repository Issues',
    parameters: [
      { name: 'owner', type: DATA_TYPES.string },
      { name: 'repo', type: DATA_TYPES.string },
      { name: 'milestone', type: DATA_TYPES.int },
      { name: 'state', type: DATA_TYPES.string },
      { name: 'assignee', type: DATA_TYPES.string },
      { name: 'creator', type: DATA_TYPES.string },
      { name: 'labels', type: DATA_TYPES.string },
      { name: 'sort', type: DATA_TYPES.string },
      { name: 'direction', type: DATA_TYPES.string },
      { name: 'since', type: DATA_TYPES.date, transform: ConvertToIso, useVariables: true },
    ]
  },
  repo_releases: {
    endpoint: '/repos/{owner}/{repo}/releases',
    name: 'repo_releases',
    label: 'Repository Releases',
    parameters: [
      { name: 'owner', type: DATA_TYPES.string },
      { name: 'repo', type: DATA_TYPES.string },
    ]
  },
  repo_pull_requests: {
    endpoint: '/repos/{owner}/{repo}/pulls',
    name: 'repo_pull_requests',
    label: 'Repository Pull Requests',
    parameters: [
      { name: 'owner', type: DATA_TYPES.string },
      { name: 'repo', type: DATA_TYPES.string },
      { name: 'state', type: DATA_TYPES.string },
      { name: 'head', type: DATA_TYPES.string },
      { name: 'base', type: DATA_TYPES.string },
      { name: 'sort', type: DATA_TYPES.string },
      { name: 'direction', type: DATA_TYPES.string },
    ]
  },
  public_events: {
    endpoint: '/events',
    name: 'public_events',
    label: 'Public Events',
    parameters: []
  },
  repo_events: {
    endpoint: '/repos/{owner}/{repo}/events',
    name: 'repo_events',
    label: 'Repository Events',
    parameters: [
      { name: 'owner', type: DATA_TYPES.string },
      { name: 'repo', type: DATA_TYPES.string },
    ]
  },
  issue_events: {
    endpoint: '/repos/{owner}/{repo}/issues/events',
    name: 'issue_events',
    label: 'Issue Events',
    parameters: [
      { name: 'owner', type: DATA_TYPES.string },
      { name: 'repo', type: DATA_TYPES.string },
    ]
  },
  user_events: {
    endpoint: '/users/{username}/events',
    name: 'user_events',
    label: 'User Events',
    parameters: [
      { name: 'username', type: DATA_TYPES.string },
    ]
  },
  org_events: {
    endpoint: '/users/{username}/events/orgs/{org}',
    name: 'org_events',
    label: 'Organisation Events',
    parameters: [
      { name: 'username', type: DATA_TYPES.string },
      { name: 'org', type: DATA_TYPES.string },
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

const getPublicEvents = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    GITHUB_RESOURCES.public_events.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'public_events',
      GITHUB_RESOURCES['public_events'].parameters,
    ) : '';
  const url = `${GITHUB_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getRepoEvents = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    GITHUB_RESOURCES.repo_events.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'repo_events',
      GITHUB_RESOURCES['repo_events'].parameters,
    ) : '';
  const url = `${GITHUB_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getIssueEvents = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    GITHUB_RESOURCES.issue_events.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'issue_events',
      GITHUB_RESOURCES['issue_events'].parameters,
    ) : '';
  const url = `${GITHUB_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getUserEvents = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    GITHUB_RESOURCES.user_events.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'user_events',
      GITHUB_RESOURCES['user_events'].parameters,
    ) : '';
  const url = `${GITHUB_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getOrgEvents = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    GITHUB_RESOURCES.org_events.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'org_events',
      GITHUB_RESOURCES['org_events'].parameters,
    ) : '';
  const url = `${GITHUB_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getRepoCommits = (params, resource, username, apiKey, sourceId) => {
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
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getRepos = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    GITHUB_RESOURCES.repos.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'repos',
      GITHUB_RESOURCES['repos'].parameters,
    ) : '';
  const url = `${GITHUB_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getRepoContributors = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    GITHUB_RESOURCES.repo_contributors.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'repo_contributors',
      GITHUB_RESOURCES['repo_contributors'].parameters,
    ) : '';
  const url = `${GITHUB_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getRepoIssues = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    GITHUB_RESOURCES.repo_issues.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'repo_issues',
      GITHUB_RESOURCES['repo_issues'].parameters,
    ) : '';
  const url = `${GITHUB_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getRepoReleases = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    GITHUB_RESOURCES.repo_releases.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'repo_releases',
      GITHUB_RESOURCES['repo_releases'].parameters,
    ) : '';
  const url = `${GITHUB_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getRepoPulls = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    GITHUB_RESOURCES.repo_pull_requests.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'repo_pull_requests',
      GITHUB_RESOURCES['repo_pull_requests'].parameters,
    ) : '';
  const url = `${GITHUB_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

export const getGitHubData = (resource, params, username, apiKey, sourceId = null) => {
  let call;
  switch(resource) {
    case GITHUB_RESOURCES.repo_commits.name:
      call = getRepoCommits;
      break;
    case GITHUB_RESOURCES.repos.name:
      call = getRepos;
      break;
    case GITHUB_RESOURCES.repo_contributors.name:
      call = getRepoContributors;
      break;
    case GITHUB_RESOURCES.repo_issues.name:
      call = getRepoIssues;
      break;
    case GITHUB_RESOURCES.repo_releases.name:
      call = getRepoReleases;
      break;
    case GITHUB_RESOURCES.repo_pull_requests.name:
      call = getRepoPulls;
      break;
    case GITHUB_RESOURCES.public_events.name:
      call = getPublicEvents;
      break;
    case GITHUB_RESOURCES.repo_events.name:
      call = getRepoEvents;
      break;
    case GITHUB_RESOURCES.issue_events.name:
      call = getIssueEvents;
      break;
    case GITHUB_RESOURCES.user_events.name:
      call = getUserEvents;
      break;
    case GITHUB_RESOURCES.org_events.name:
      call = getOrgEvents;
      break;
  default:
    console.error('Invalid');
    break;
  }
  return call(params, resource, username, apiKey, sourceId)
  .then(response => {
    return {
      sourceId,
      data: response,
      properties: RESOURCE_PROPERTIES[resource],
    };
  })
};