import { getToken } from '../utils/Helpers';

const SALESFORCE_URI = 'https://um5.salesforce.com';

export const SALESFORCE_RESOURCES = {
  leads: {},
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