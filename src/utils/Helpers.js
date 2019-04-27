
import { pathOr } from 'ramda';

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
  return pathOr('', [dataProvider], parsedTokens);
}

export const generateQueryString = (params, resource, paramConfigs) => {
  const resourceParameters = paramConfigs;
  return params.map(param => {
    const transformation = resourceParameters.find(
      resourceParameter => resourceParameter.name === param.name
    ).transform;
    return param.name + '=' + (transformation ? transformation(param.value) : param.value);
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