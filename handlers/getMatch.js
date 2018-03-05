import { NA, MATCH_ENDPOINT } from '../constants/riotConstants';
import {
  getApiKey,
  requestHandler,
  updatePlayerItemInDB,
  generateMatchParams,
  mapQueueIdToMatchType,
} from '../utilities/riotUtilities';

export async function main(event, context, callback) {
  const { summonerName, gameId, queueId } = event.pathParameters;

  const options = {
    url: NA + MATCH_ENDPOINT + gameId,
    method: 'GET',
    headers: {
      'X-Riot-Token': await getApiKey(),
    },
  };

  const matchData = await requestHandler(options);
  const matchType = mapQueueIdToMatchType(queueId);

  const params = generateMatchParams(summonerName, matchData, matchType);

  updatePlayerItemInDB(params);

  return callback(null, matchData);
}
