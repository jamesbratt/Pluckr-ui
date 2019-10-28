import { getToken, injectParametersIntoEndpoint, proxyRequest } from '../utils/Helpers';

const JIRA_URI = 'https://api.atlassian.com/ex/jira/81f1b8cd-dcfe-4a2e-bc7e-d9da91d9ff34';
const INTEGRATION_TYPE = 'jira';

export const JIRA_RESOURCES = {
  labels: {
    endpoint: '/rest/api/3/label',
    name: 'labels',
    label: 'Labels',
    parameters: []
  },
};

const getLabels = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    JIRA_RESOURCES.current_user.endpoint,
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
    case JIRA_RESOURCES.labels.name:
      call = getLabels;
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