import { generateQueryString, injectParametersIntoEndpoint, proxyRequest } from './Helpers';

const GenerateRequest = (provider, resourceUri, uriParameters, sourceId, username, apiKey) => {

  const urlComponents = injectParametersIntoEndpoint(
    resourceUri,
    uriParameters,
  );

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const resourceParams = provider.swagger_paths[resourceUri].get.parameters;

  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      resourceParams,
    ) : '';
  
  const { swagger_host, swagger_base_path, id } = provider;
  const url = `${swagger_host}${swagger_base_path}${endPoint}${queryString}`;

  return proxyRequest(url, id, '', username, apiKey, sourceId);
}

export default GenerateRequest;