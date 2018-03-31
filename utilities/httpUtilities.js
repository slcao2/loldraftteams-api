import { HEADERS } from '../constants/awsConstants';
import { getApiKey } from '../utilities/riotUtilities';

export const generateOptionsRequest = async (url) => {
  const options = {
    url,
    method: 'GET',
    headers: {
      'X-Riot-Token': await getApiKey(),
    },
  };
  return options;
};

export const generate200Response = (data) => {
  const response = {
    statusCode: 200,
    headers: HEADERS,
    body: JSON.stringify(data),
  };
  return response;
};

export const generateNon200Response = (error) => {
  const response = {
    statusCode: error.statusCode,
    headers: HEADERS,
    body: error.statusMessage,
  };
  return response;
};
