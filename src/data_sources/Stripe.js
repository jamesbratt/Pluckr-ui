import { getToken, injectParametersIntoEndpoint, proxyRequest, generateQueryString } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const STRIPE_URI = 'https://api.stripe.com/v1';
const INTEGRATION_TYPE = 'stripe';

export const STRIPE_RESOURCES = {
  customers: {
    endpoint: '/customers',
    name: 'customers',
    label: 'Customers',
    parameters: [
      { name: 'limit', type: DATA_TYPES.int },
    ]
  },
  balance_transactions: {
    endpoint: '/balance_transactions',
    name: 'balance_transactions',
    label: 'Balance Transactions',
    parameters: [
      { name: 'limit', type: DATA_TYPES.int },
    ]
  },
  charges: {
    endpoint: '/charges',
    name: 'charges',
    label: 'Charges',
    parameters: [
      { name: 'limit', type: DATA_TYPES.int },
    ]
  },
  refunds: {
    endpoint: '/refunds',
    name: 'refunds',
    label: 'Refunds',
    parameters: [
      { name: 'limit', type: DATA_TYPES.int },
    ]
  },
  invoices: {
    endpoint: '/invoices',
    name: 'invoices',
    label: 'Invoices',
    parameters: [
      { name: 'limit', type: DATA_TYPES.int },
    ]
  },
  orders: {
    endpoint: '/orders',
    name: 'orders',
    label: 'Orders',
    parameters: [
      { name: 'limit', type: DATA_TYPES.int },
    ]
  },
};

const getCustomers = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    STRIPE_RESOURCES.customers.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'customers',
      STRIPE_RESOURCES['customers'].parameters,
    ) : '';
  const url = `${STRIPE_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getBalanceTransactions = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    STRIPE_RESOURCES.balance_transactions.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'balance_transactions',
      STRIPE_RESOURCES['balance_transactions'].parameters,
    ) : '';
  const url = `${STRIPE_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getCharges = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    STRIPE_RESOURCES.charges.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'charges',
      STRIPE_RESOURCES['charges'].parameters,
    ) : '';
  const url = `${STRIPE_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getRefunds = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    STRIPE_RESOURCES.refunds.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'refunds',
      STRIPE_RESOURCES['refunds'].parameters,
    ) : '';
  const url = `${STRIPE_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getInvoices = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    STRIPE_RESOURCES.invoices.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'invoices',
      STRIPE_RESOURCES['invoices'].parameters,
    ) : '';
  const url = `${STRIPE_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getOrders = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    STRIPE_RESOURCES.orders.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'orders',
      STRIPE_RESOURCES['orders'].parameters,
    ) : '';
  const url = `${STRIPE_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

export const getStripeData = (resource, params, username, apiKey, sourceId = null) => {
  let call;
  switch(resource) {
    case STRIPE_RESOURCES.customers.name:
      call = getCustomers;
      break;
    case STRIPE_RESOURCES.balance_transactions.name:
      call = getBalanceTransactions;
      break;
    case STRIPE_RESOURCES.charges.name:
      call = getCharges;
      break;
    case STRIPE_RESOURCES.refunds.name:
      call = getRefunds;
      break;
    case STRIPE_RESOURCES.invoices.name:
      call = getInvoices;
      break;
    case STRIPE_RESOURCES.orders.name:
      call = getOrders;
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