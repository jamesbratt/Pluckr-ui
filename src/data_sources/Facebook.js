import { getToken, injectParametersIntoEndpoint, proxyRequest } from '../utils/Helpers';

const FACEBOOK_URI = 'https://graph.facebook.com';
const INTEGRATION_TYPE = 'facebook';

export const FACEBOOK_RESOURCES = {
  current_user: {
    endpoint: '/me',
    name: 'current_user',
    label: 'Current User',
    parameters: []
  },
};

const getCurrentUser = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    FACEBOOK_RESOURCES.current_user.endpoint,
    params,
  )

  const { endPoint } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const url = `${FACEBOOK_URI}${endPoint}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

export const getFacebookData = (resource, params, username, apiKey, sourceId = null) => {
  let call;
  switch(resource) {
    case FACEBOOK_RESOURCES.current_user.name:
      call = getCurrentUser;
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