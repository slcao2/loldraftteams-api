import _ from 'lodash';

import { HEADERS } from '../constants/awsConstants';
import { NOT_FOUND, RATE_LIMIT_EXCEEDED } from '../constants/riotConstants';
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

export const generateNon200Response = (error, options) => {
  const summoner = error.statusCode === NOT_FOUND ? options.url.split('by-name/')[1] : undefined;
  const retryAfter = error.statusCode === RATE_LIMIT_EXCEEDED ? error['Retry-After'] : undefined;

  const response = {
    statusCode: error.statusCode,
    headers: HEADERS,
    body: summoner || retryAfter || error.statusMessage,
  };
  return response;
};
