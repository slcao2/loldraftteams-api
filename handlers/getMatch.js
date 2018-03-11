import { NA, MATCH_ENDPOINT } from '../constants/riotConstants';
import {
  requestHandler,
  updatePlayerItemInDB,
  generateMatchParams,
  mapQueueIdToMatchType,
} from '../utilities/riotUtilities';
import { generate200Response, generateOptionsRequest } from '../utilities/httpUtilities';

export const blank = 0;

export async function main(event, context, callback) {
  const { summonerName, gameId, queueId } = event.pathParameters;

  const url = NA + MATCH_ENDPOINT + gameId;
  const options = await generateOptionsRequest(url);

  const matchData = await requestHandler(options);
  const matchType = mapQueueIdToMatchType(queueId);

  const params = generateMatchParams(summonerName, matchData, matchType);

  updatePlayerItemInDB(params);

  const response = generate200Response(matchData);

  callback(null, response);
}
