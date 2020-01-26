
import { pathOr } from 'ramda';
import axios from "axios";
import { VARIABLES } from '../Constants';

export const GenerateGuid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const ConvertToEpoch = (dateString) => {
  const splittedDate = dateString.split('-');
  return new Date(parseInt(splittedDate[0]), parseInt(splittedDate[1]) - 1, parseInt(splittedDate[2])).getTime() / 1000;
}

export const ConvertToIso = (dateString) => {
  return new Date(dateString).toISOString();
}

export const getToken = (dataProvider) => {
  const tokens = localStorage.getItem('token');
  const parsedTokens = tokens ? JSON.parse(tokens) : {};
  return pathOr('', [dataProvider, 'key'], parsedTokens);
}

export const getTokenId = (dataProvider) => {
  const tokens = localStorage.getItem('token');
  const parsedTokens = tokens ? JSON.parse(tokens) : {};
  return pathOr('', [dataProvider, 'id'], parsedTokens);
}

export const calculateVariableDate = (param) => {
  const variables = VARIABLES.reduce((acc, cur) => {
    acc[cur.value] = cur.value;
    return acc;
  }, {});

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  switch(param.value) {
    case variables.CURRENT_MONTH_BEGINNING:
      return new Date(year, month, 1).getTime();
    case variables.LAST_30_DAYS:
      return new Date(year, month, day).getTime() - 30*24*60*60*1000;
    case variables.LAST_7_DAYS:
      return new Date(year, month, day).getTime() - 7*24*60*60*1000;
    case variables.LAST_24_HOURS:
      return new Date(year, month, day).getTime() - 24*60*60*1000;
    case variables.CURRENT_DAY:
      return new Date(year, month, day).getTime();
    default:
      return null;
  }
}

export const generateQueryString = (params, resource, paramConfigs) => {
  const resourceParameters = paramConfigs;
  return params.map(param => {
    let value = param.value;
    const transformation = resourceParameters.find(
      resourceParameter => resourceParameter.name === param.name
    ).transform;
    if (transformation && VARIABLES.find(v => v.value === param.value)) {
      value = calculateVariableDate(param);
    }
    return param.name + '=' + (transformation ? transformation(value) : value);
  }).join('&');
};

export const injectParametersIntoEndpoint = (resourcEndpoint, params) => {
  let endPoint = resourcEndpoint;
  let parametersToRemove = [];
  let parameters = params;

  parameters.forEach(param => {
    const endpointContainsParam = endPoint.indexOf(`{${param.name}}`) !== -1;
    if (endpointContainsParam) {
      endPoint = endPoint.replace(`{${param.name}}`, param.value);
      parametersToRemove.push(param.name);
    }
  });

  if (parametersToRemove.length > 0) {
    parameters = params.filter(param => parametersToRemove.indexOf(param.name) === -1);
  }

  return { endPoint, parameters };
}

export const proxyRequest = (url, key, integration_type, username, apiKey, source_id) => {

  let payload = {};

  if(key) {
    payload = {
      url,
      key,
      integration_type,
    }
  }

  if(!key && source_id) {
    payload = {
      url,
      source_id,
      integration_type,
    }
  }

  if(!key && !source_id) {
    payload = {
      url,
      integration_type,
    }
  }

  return axios.post(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/integration-request/`,
    JSON.stringify(payload),
    {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${apiKey}`
      },
    }
  ).then(response => {
    return response.data;
  })
  .catch(error => {
    throw Error(error.response.data.error.message);
  });
}