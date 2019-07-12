import { getToken, proxyRequest } from '../utils/Helpers';

const SALESFORCE_URI = 'https://um5.salesforce.com';
const INTEGRATION_TYPE = 'salesforce';

export const SALESFORCE_RESOURCES = {
  sobjects: {
    endpoint: '/services/data/v40.0/sobjects/',
    name: 'sobjects',
    label: 'sobjects',
    parameters: []
  },
};

const getSObjects = (params, username, apiKey) => {
  // Do something with the passed params...
  const key = getToken(INTEGRATION_TYPE);
  const url = `${SALESFORCE_URI}/services/data/v40.0/sobjects/`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey);
};

export const getSalesforceData = (resource, params, username, apiKey) => {
  let call;
  switch(resource) {
    case SALESFORCE_RESOURCES.sobjects.name:
    call = getSObjects;
        break;
  default:
    console.error('Invalid');
    break;
  }
  return call(params, username, apiKey)
  .then(response => {
    return {
      data: response,
      properties: null,
    };
  })
};