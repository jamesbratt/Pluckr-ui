import { generateQueryString, injectParametersIntoEndpoint, proxyRequest } from './Helpers';

const GenerateRequest = (provider, resourceUri, uriParameters, uriParametersModel, sourceId, username, apiKey) => {

  const urlComponents = injectParametersIntoEndpoint(
    resourceUri,
    uriParameters,
  );

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      uriParametersModel,
    ) : '';

  const { swagger_host, swagger_base_path, id, swagger_definition } = provider;
  const url = `${swagger_host}${swagger_base_path ? swagger_base_path : ''}${endPoint}${queryString}`;

  return proxyRequest(url, id, '', username, apiKey, sourceId, swagger_definition);
}

export default GenerateRequest;