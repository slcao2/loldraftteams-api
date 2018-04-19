import { MATCH_ENDPOINT } from '../constants/riotConstants';
import {
  requestHandler,
  updatePlayerItemInDB,
  generateMatchParams,
  mapQueueIdToMatchType,
  mapRegionToUrlEndpoint,
} from '../utilities/riotUtilities';
import { generate200Response, generateOptionsRequest } from '../utilities/httpUtilities';
import { lowerCaseRemoveSpacesDecode } from '../utilities/stringUtilities';

export const blank = 0;

export async function main(event, context, callback) {
  const {
    region, summonerName, gameId, queueId,
  } = event.pathParameters;
  const formattedSummonerName = lowerCaseRemoveSpacesDecode(summonerName);

  const url = mapRegionToUrlEndpoint(region) + MATCH_ENDPOINT + gameId;
  const options = await generateOptionsRequest(url);

  const matchData = await requestHandler(options);
  if (matchData.statusCode) {
    callback(null, matchData);
    return;
  }
  const matchType = mapQueueIdToMatchType(queueId);

  const params = generateMatchParams(formattedSummonerName, matchData, matchType, region);

  updatePlayerItemInDB(params);

  const response = generate200Response(matchData);

  callback(null, response);
}
