import { getToken } from '../utils/Helpers';

const SALESFORCE_URI = 'https://um5.salesforce.com';

export const SALESFORCE_RESOURCES = {
  sobjects: {
    endpoint: '/services/data/v40.0/sobjects/',
    name: 'sobjects',
    label: 'sobjects',
    parameters: []
  },
};

const getSObjects = (params) => {
    const token = getToken('salesforce');
    return fetch(`${SALESFORCE_URI}/services/data/v40.0/sobjects/`, {
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

export const getUserInfo = () => {
  const token = getToken('salesforce');
  return fetch(`${SALESFORCE_URI}/services/data/v40.0/sobjects/`, {
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(response => {
    return { provider: 'salesforce', status: response.status };
  });
};

export const getSalesforceData = (resource, params) => {
  let call;
  switch(resource) {
    case SALESFORCE_RESOURCES.sobjects.name:
    call = getSObjects;
        break;
  default:
    console.error('Invalid');
    break;
  }
  return call(params)
  .then(response => {
    return {
      data: response,
      properties: null,
    };
  })
};