import { getToken, injectParametersIntoEndpoint, proxyRequest, ConvertToIso, generateQueryString } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const FINANCE_URI = 'https://cloud.iexapis.com/stable';
const INTEGRATION_TYPE = 'finance';

export const FINANCE_RESOURCES = {
  historical: {
    endpoint: '/stock/{symbol}/chart/{range}',
    name: 'historical',
    label: 'Historical Stock Price',
    parameters: [
        {
          name: 'symbol',
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
        {
          name: 'range',
          type: DATA_TYPES.list,
          options: [
            { value: '5y', label: 'Five years' },
            { value: '2y', label: 'Two years' },
            { value: '1y', label: 'One year' },
            { value: 'ytd', label: 'Year-to-date' },
            { value: '6m', label: 'Six months' },
            { value: '3m', label: 'Three months' },
            { value: '1m', label: 'One month' },
            // { value: '1mm', label: 'NVIDIA Corporation' },
            { value: '5d', label: 'Five Days' },
            // { value: 'ORCL', label: 'Oracle Corporation' }
          ]
        },
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