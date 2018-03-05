import {
  NA,
  MATCH_LIST_ENDPOINT,
} from '../constants/riotConstants';
import {
  getApiKey,
  requestHandler,
  updatePlayerItemInDB,
  generateMatchListParams,
  mapQueueIdToMatchListType,
} from '../utilities/riotUtilities';

export async function main(event, context, callback) {
  const { summonerName, accountId, queueId } = event.pathParameters;

  const options = {
    url: `${NA + MATCH_LIST_ENDPOINT + accountId}?queue=${queueId}`,
    method: 'GET',
    headers: {
      'X-Riot-Token': await getApiKey(),
    },
  };

  const matchList = await requestHandler(options);
  const matchListType = mapQueueIdToMatchListType(queueId);

  const params = generateMatchListParams(summonerName, matchList, matchListType);

  updatePlayerItemInDB(params);

  return callback(null, matchList);
}
