import { getToken, injectParametersIntoEndpoint, proxyRequest, generateQueryString } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const WRIKE_URI = 'https://www.wrike.com/api/v4/';
const INTEGRATION_TYPE = 'wrike';

export const WRIKE_RESOURCES = {
  contacts: {
    endpoint: '/contacts',
    name: 'contacts',
    label: 'Contacts',
    parameters: []
  },
  workflows: {
    endpoint: '/workflows',
    name: 'workflows',
    label: 'Workflows',
    parameters: []
  },
  tasks: {
    endpoint: '/tasks',
    name: 'tasks',
    label: 'Tasks',
    parameters: []
  },
  tasks_by_folder: {
    endpoint: '/folders/{folderId}/tasks',
    name: 'tasks_by_folder',
    label: 'Tasks By Folder',
    parameters: [
      { name: 'folderId', type: DATA_TYPES.string },
    ]
  },
  tasks_by_space: {
    endpoint: '/spaces/{spaceId}/tasks',
    name: 'tasks_by_space',
    label: 'Tasks By Space',
    parameters: [
      { name: 'spaceId', type: DATA_TYPES.string },
    ]
  },
  timelogs: {
    endpoint: '/timelogs',
    name: 'timelogs',
    label: 'Timelogs',
    parameters: []
  },
  audit_logs: {
    endpoint: '/audit_log',
    name: 'audit_logs',
    label: 'Auditlogs',
    parameters: [
      { name: 'pageSize', type: DATA_TYPES.int },
    ]
  },
};

const getContacts = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    WRIKE_RESOURCES.contacts.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'contacts',
      WRIKE_RESOURCES['contacts'].parameters,
    ) : '';
  const url = `${WRIKE_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getWorkflows = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    WRIKE_RESOURCES.workflows.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'workflows',
      WRIKE_RESOURCES['workflows'].parameters,
    ) : '';
  const url = `${WRIKE_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getTasks = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    WRIKE_RESOURCES.tasks.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'tasks',
      WRIKE_RESOURCES['tasks'].parameters,
    ) : '';
  const url = `${WRIKE_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getTasksByFolder = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    WRIKE_RESOURCES.tasks_by_folder.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'tasks_by_folder',
      WRIKE_RESOURCES['tasks_by_folder'].parameters,
    ) : '';
  const url = `${WRIKE_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getTasksBySpace = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    WRIKE_RESOURCES.tasks_by_space.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'tasks_by_space',
      WRIKE_RESOURCES['tasks_by_space'].parameters,
    ) : '';
  const url = `${WRIKE_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getTimelogs = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    WRIKE_RESOURCES.timelogs.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'timelogs',
      WRIKE_RESOURCES['timelogs'].parameters,
    ) : '';
  const url = `${WRIKE_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getAuditlogs = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    WRIKE_RESOURCES.audit_logs.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'audit_logs',
      WRIKE_RESOURCES['audit_logs'].parameters,
    ) : '';
  const url = `${WRIKE_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

export const getWrikeData = (resource, params, username, apiKey, sourceId = null) => {
  let call;
  switch(resource) {
    case WRIKE_RESOURCES.contacts.name:
      call = getContacts;
      break;
    case WRIKE_RESOURCES.workflows.name:
      call = getWorkflows;
      break;
    case WRIKE_RESOURCES.tasks.name:
      call = getTasks;
      break;
    case WRIKE_RESOURCES.tasks_by_folder.name:
      call = getTasksByFolder;
      break;
    case WRIKE_RESOURCES.tasks_by_space.name:
      call = getTasksBySpace;
      break;
    case WRIKE_RESOURCES.timelogs.name:
      call = getTimelogs;
      break;
    case WRIKE_RESOURCES.audit_logs.name:
      call = getAuditlogs;
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