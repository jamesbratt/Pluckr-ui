import { getToken, injectParametersIntoEndpoint, proxyRequest } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const STRIPE_URI = 'https://api.stripe.com/v1';
const INTEGRATION_TYPE = 'stripe';

export const STRIPE_RESOURCES = {
  customers: {
    endpoint: '/customers',
    name: 'customers',
    label: 'Customers',
    parameters: []
  },
};

const getCustomers = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    STRIPE_RESOURCES.customers.endpoint,
    params,
  )

  const { endPoint } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const url = `${STRIPE_URI}${endPoint}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

export const getStripeData = (resource, params, username, apiKey, sourceId = null) => {
  let call;
  switch(resource) {
    case STRIPE_RESOURCES.customers.name:
      call = getCustomers;
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