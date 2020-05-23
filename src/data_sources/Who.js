import { getToken, injectParametersIntoEndpoint, proxyRequest, generateQueryString } from '../utils/Helpers';
import { DATA_TYPES } from '../Constants';

const WHO_URI = 'https://ghoapi.azureedge.net/api';
const INTEGRATION_TYPE = 'who';

export const whoAsyncTasks = async (username, apiKey) => {
  const indicators = await proxyRequest(`${WHO_URI}/Indicator`, null, INTEGRATION_TYPE, username, apiKey, null);
  const countries = await proxyRequest(`${WHO_URI}/DIMENSION/COUNTRY/DimensionValues`, null, INTEGRATION_TYPE, username, apiKey, null);
  const indicatorOptions = indicators.value.map((indicator) => ({ value: indicator.IndicatorCode, label: indicator.IndicatorName }));
  const countryOptions = countries.value.map((country) => ({ value: country.Code, label: country.Title }));

  WHO_RESOURCES.global_health_observatory.parameters[0].options = indicatorOptions;
  WHO_RESOURCES.global_health_observatory.parameters[1].options = countryOptions;
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

const constructWhoQuery = (params,) => {
  const paramToDimensionMapper = {
    country: 'SpatialDim',
    year: 'TimeDim',
  };

  if (params.length == 0) {
    return '';
  }

  let query = '?$filter=';
  params.forEach((param, index) => {
    const operator = index === params.length -1 ? '' : ' and ';
    let parameterValue = null;

    switch(typeof param.value) {
      case 'string':
        parameterValue = !isNaN(param.value) ? parseInt(param.value) : `'${param.value}'`;
        break;
      default:
        parameterValue = param.value;
    }

    query += `${paramToDimensionMapper[param.name]} eq ${parameterValue}${operator}`
  });
  return query;
}

const getGlobalHealth = (params, resource, username, apiKey, sourceId) => {
  const query = constructWhoQuery(params.filter(params => params.name !== 'indicator'));

  const urlComponents = injectParametersIntoEndpoint(
    WHO_RESOURCES.global_health_observatory.endpoint,
    params,
  )

  const { endPoint } = urlComponents;

  const key = getToken(INTEGRATION_TYPE);

  const url = `${WHO_URI}${endPoint}${query}`;
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