import {
  NA,
  MATCH_LIST_ENDPOINT,
} from '../constants/riotConstants';
import {
  requestHandler,
  updatePlayerItemInDB,
  generateMatchListParams,
  mapQueueIdToMatchListType,
} from '../utilities/riotUtilities';
import { generate200Response, generateOptionsRequest } from '../utilities/httpUtilities';
import { lowerCaseRemoveSpacesDecode } from '../utilities/stringUtilities';

export const blank = 0;

export async function main(event, context, callback) {
  const { summonerName, accountId, queueId } = event.pathParameters;
  const formattedSummonerName = lowerCaseRemoveSpacesDecode(summonerName);

  const url = `${NA + MATCH_LIST_ENDPOINT + accountId}?queue=${queueId}`;
  const options = await generateOptionsRequest(url);

  const matchList = await requestHandler(options);
  const matchListType = mapQueueIdToMatchListType(queueId);

  const params = generateMatchListParams(formattedSummonerName, matchList, matchListType);

  updatePlayerItemInDB(params);

  const response = generate200Response(matchList);

  callback(null, response);
}
