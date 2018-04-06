import _ from 'lodash';

import { HEADERS } from '../constants/awsConstants';
import { RATE_LIMIT_EXCEEDED } from '../constants/riotConstants';
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
  const riotHeaders = {
    retryAfter: error['Retry-After'],
  };
  const errorHeaders = _.assign(riotHeaders, HEADERS);

  const response = {
    statusCode: error.statusCode,
    headers: error.statusCode === RATE_LIMIT_EXCEEDED ? errorHeaders : HEADERS,
    body: error.statusMessage,
  };
  return response;
};
