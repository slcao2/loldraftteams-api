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
  const data = event.body;

  const options = {
    url: `${NA + MATCH_LIST_ENDPOINT + data.accountId}?queue=${data.queueId}`,
    method: 'GET',
    headers: {
      'X-Riot-Token': await getApiKey(),
    },
  };

  const matchList = await requestHandler(options);
  const matchListType = mapQueueIdToMatchListType(data.queueId);

  const params = generateMatchListParams(data.summonerName, matchList, matchListType);

  updatePlayerItemInDB(params);

  return callback(null, matchList);
}
