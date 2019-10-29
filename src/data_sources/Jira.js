import { getToken, injectParametersIntoEndpoint, proxyRequest } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const JIRA_URI = 'https://api.atlassian.com/ex/jira/e015d9ac-554a-4013-b4bb-49d8208719ea';
const INTEGRATION_TYPE = 'jira';

export const JIRA_RESOURCES = {
  issues: {
    endpoint: '/rest/api/2/search',
    name: 'issues',
    label: 'Issues',
    parameters: [
        { name: 'jql', type: DATA_TYPES.string },
        { name: 'validateQuery', type: DATA_TYPES.string }
    ]
  },
  versions: {
    endpoint: '/rest/api/2/project/{projectIdOrKey}/version',
    name: 'versions',
    label: 'Versions',
    parameters: [
        { name: 'projectIdOrKey', type: DATA_TYPES.string },
    ]
  },
  projects: {
    endpoint: '/rest/api/2/project/search',
    name: 'projects',
    label: 'Projects',
    parameters: []
  },
};

const getIssues = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    JIRA_RESOURCES.issues.endpoint,
    params,
  )

  const { endPoint } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const url = `${JIRA_URI}${endPoint}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getVersions = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    JIRA_RESOURCES.versions.endpoint,
    params,
  )

  const { endPoint } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const url = `${JIRA_URI}${endPoint}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getProjects = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    JIRA_RESOURCES.projects.endpoint,
    params,
  )

  const { endPoint } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const url = `${JIRA_URI}${endPoint}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

export const getJiraData = (resource, params, username, apiKey, sourceId = null) => {
  let call;
  switch(resource) {
    case JIRA_RESOURCES.issues.name:
      call = getIssues;
      break;
    case JIRA_RESOURCES.versions.name:
      call = getVersions;
      break;
    case JIRA_RESOURCES.projects.name:
      call = getProjects;
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
      properties: null,
    };
  })
};