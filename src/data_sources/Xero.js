import { getToken, injectParametersIntoEndpoint, proxyRequest, generateQueryString } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const XERO_URI = 'https://api.xero.com/api.xro/2.0';
const INTEGRATION_TYPE = 'xero';

export const XERO_RESOURCES = {
  accounts: {
    endpoint: '/Accounts',
    name: 'accounts',
    label: 'Accounts',
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

export const getXeroData = (resource, params, username, apiKey, sourceId = null) => {
  let call;
  switch(resource) {
    case XERO_RESOURCES.accounts.name:
      call = getAccounts;
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