import { getToken, injectParametersIntoEndpoint, proxyRequest, generateQueryString } from '../utils/Helpers';

const XERO_URI = 'https://api.xero.com/api.xro/2.0';
const INTEGRATION_TYPE = 'xero';

export const XERO_RESOURCES = {
  accounts: {
    endpoint: '/Accounts',
    name: 'accounts',
    label: 'Accounts',
    parameters: []
  },
  bank_transfers: {
    endpoint: '/BankTransfers',
    name: 'bank_transfers',
    label: 'Bank Transfers',
    parameters: []
  },
  contacts: {
    endpoint: '/Contacts',
    name: 'contacts',
    label: 'Contacts',
    parameters: []
  },
  employees: {
    endpoint: '/Employees',
    name: 'employees',
    label: 'Employees',
    parameters: []
  },
  invoices: {
    endpoint: '/Invoices',
    name: 'invoices',
    label: 'Invoices',
    parameters: []
  },
  payments: {
    endpoint: '/Payments',
    name: 'payments',
    label: 'Payments',
    parameters: []
  },
};

const getAccounts = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    XERO_RESOURCES.accounts.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'accounts',
      XERO_RESOURCES['accounts'].parameters,
    ) : '';
  const url = `${XERO_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getBankTransfers = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    XERO_RESOURCES.bank_transfers.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'bank_transfers',
      XERO_RESOURCES['bank_transfers'].parameters,
    ) : '';
  const url = `${XERO_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getContacts = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    XERO_RESOURCES.contacts.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'contacts',
      XERO_RESOURCES['contacts'].parameters,
    ) : '';
  const url = `${XERO_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getEmployees = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    XERO_RESOURCES.employees.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'employees',
      XERO_RESOURCES['employees'].parameters,
    ) : '';
  const url = `${XERO_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getInvoices = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    XERO_RESOURCES.invoices.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'invoices',
      XERO_RESOURCES['invoices'].parameters,
    ) : '';
  const url = `${XERO_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

const getPayments = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    XERO_RESOURCES.payments.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'payments',
      XERO_RESOURCES['payments'].parameters,
    ) : '';
  const url = `${XERO_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

export const getXeroData = (resource, params, username, apiKey, sourceId = null) => {
  let call;
  switch(resource) {
    case XERO_RESOURCES.accounts.name:
      call = getAccounts;
      break;
    case XERO_RESOURCES.bank_transfers.name:
      call = getBankTransfers;
      break;
    case XERO_RESOURCES.contacts.name:
      call = getContacts;
    break;
      case XERO_RESOURCES.employees.name:
      call = getEmployees;
    break;
      case XERO_RESOURCES.invoices.name:
      call = getInvoices;
    break;
      case XERO_RESOURCES.payments.name:
      call = getPayments;
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