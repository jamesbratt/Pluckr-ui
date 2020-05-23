import { getToken, injectParametersIntoEndpoint, proxyRequest, generateQueryString } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const WHO_URI = 'https://ghoapi.azureedge.net/api';
const INTEGRATION_TYPE = 'who';

export const whoAsyncTasks = async (username, apiKey) => {
  const indicators = await proxyRequest('https://ghoapi.azureedge.net/api/Indicator', null, INTEGRATION_TYPE, username, apiKey, null);

  const options = indicators.value.map((indicator) => ({ value: indicator.IndicatorCode, label: indicator.IndicatorName }));

  WHO_RESOURCES.global_health_observatory.parameters[0].options = options;
};

export const WHO_RESOURCES = {
  global_health_observatory: {
    endpoint: '/{indicator}',
    name: 'global_health_observatory',
    label: 'Global Health Observatory',
    parameters: [
        {
          name: 'indicator',
          type: DATA_TYPES.list,
          options: []
        },
        {
          name: 'country',
          type: DATA_TYPES.list,
          options: []
        },
        {
          name: 'year',
          type: DATA_TYPES.int,
        },
    ]
  },
};

const getGlobalHealth = (params, resource, username, apiKey, sourceId) => {
  const urlComponents = injectParametersIntoEndpoint(
    WHO_RESOURCES.global_health_observatory.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'global_health_observatory',
      WHO_RESOURCES['global_health_observatory'].parameters,
    ) : '';

  const url = `${WHO_URI}${endPoint}${queryString}`;
  return proxyRequest(url, key, INTEGRATION_TYPE, username, apiKey, sourceId);
};

export const getWhoData = (resource, params, username, apiKey, sourceId = null) => {
  let call;
  switch(resource) {
    case WHO_RESOURCES.global_health_observatory.name:
      call = getGlobalHealth;
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