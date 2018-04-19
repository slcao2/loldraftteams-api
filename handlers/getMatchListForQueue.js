import {
  MATCH_LIST_ENDPOINT,
  NOT_FOUND,
} from '../constants/riotConstants';
import {
  requestHandler,
  updatePlayerItemInDB,
  generateMatchListParams,
  mapQueueIdToMatchListType,
  mapRegionToUrlEndpoint,
} from '../utilities/riotUtilities';
import { generate200Response, generateOptionsRequest } from '../utilities/httpUtilities';
import { lowerCaseRemoveSpacesDecode } from '../utilities/stringUtilities';

export const blank = 0;

export async function main(event, context, callback) {
  const {
    region, summonerName, accountId, queueId,
  } = event.pathParameters;
  const formattedSummonerName = lowerCaseRemoveSpacesDecode(summonerName);

  const url = `${mapRegionToUrlEndpoint(region) + MATCH_LIST_ENDPOINT + accountId}?queue=${queueId}`;
  const options = await generateOptionsRequest(url);

  let matchList = await requestHandler(options);
  if (matchList.statusCode === NOT_FOUND) {
    matchList = {};
  } else if (matchList.statusCode) {
    callback(null, matchList);
    return;
  }
  const matchListType = mapQueueIdToMatchListType(queueId);

  const params = generateMatchListParams(formattedSummonerName, matchList, matchListType, region);

  updatePlayerItemInDB(params);

  const response = generate200Response(matchList);

  callback(null, response);
}
