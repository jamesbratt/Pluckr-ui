import { getToken, injectParametersIntoEndpoint, proxyRequest, ConvertToIso, generateQueryString } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const FINANCE_URI = 'https://financialmodelingprep.com/api/v3';
const INTEGRATION_TYPE = 'finance';

export const FINANCE_RESOURCES = {
  historical: {
    endpoint: '/historical-price-full/{company}',
    name: 'historical',
    label: 'Historical Stock Price',
    parameters: [
        {
          name: 'company',
          type: DATA_TYPES.list,
          options: [
            { value: 'GOOG', label: 'Alphabet Inc.' },
            { value: 'AMZN', label: 'Amazon.com Inc.' },
            { value: 'AAPL', label: 'Apple Inc.' },
            { value: 'BP', label: 'BP p.l.c.' },
            { value: 'CSCO', label: 'Cisco Systems Inc.' },
            { value: 'FB', label: 'Facebook Inc.' },
            { value: 'GM', label: 'General Motors Company' },
            { value: 'NVDA', label: 'NVIDIA Corporation' },
            { value: 'MSFT', label: 'Microsoft' },
            { value: 'ORCL', label: 'Oracle Corporation' }
          ]
        },
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
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'historical',
      FINANCE_RESOURCES['historical'].parameters,
    ) : '';

  const url = `${FINANCE_URI}${endPoint}${queryString}`;
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