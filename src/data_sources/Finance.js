import { getToken, injectParametersIntoEndpoint, proxyRequest, ConvertToIso } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const FINANCE_URI = 'https://financialmodelingprep.com/api/v3';
const INTEGRATION_TYPE = 'finance';

export const FINANCE_RESOURCES = {
  historical: {
    endpoint: '/historical-price-full/{company}',
    name: 'historical',
    label: 'Historical Stock Price',
    parameters: [
        { name: 'company', type: DATA_TYPES.string },
        { name: 'from', type: DATA_TYPES.date, transform: ConvertToIso, useVariables: true },
        { name: 'to', type: DATA_TYPES.date, transform: ConvertToIso, useVariables: false },
    ]
  },
};

const getHistorical = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    FINANCE_RESOURCES.historical.endpoint,
    params,
  )

  const { endPoint } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const url = `${FINANCE_URI}${endPoint}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

export const getFinanceData = (resource, params, username, apiKey, sourceId = null) => {
  let call;
  switch(resource) {
    case FINANCE_RESOURCES.historical.name:
      call = getHistorical;
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