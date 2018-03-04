import { NA, MATCH_ENDPOINT } from '../constants/riotConstants';
import {
  getApiKey,
  requestHandler,
  updatePlayerItemInDB,
  generateMatchParams,
  mapQueueIdToMatchType,
} from '../utilities/riotUtilities';

export async function main(event, context, callback) {
  const data = event.body;

  const options = {
    url: NA + MATCH_ENDPOINT + data.gameId,
    method: 'GET',
    headers: {
      'X-Riot-Token': await getApiKey(),
    },
  };

  const matchData = await requestHandler(options);
  const matchType = mapQueueIdToMatchType(data.queueId);

  const params = generateMatchParams(data.summonerName, matchData, matchType);

  updatePlayerItemInDB(params);

  return callback(null, matchData);
}
