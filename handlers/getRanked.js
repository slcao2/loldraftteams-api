import { NA, RANKED_POSITION_ENDPOINT } from '../constants/riotConstants';
import {
  getApiKey,
  requestHandler,
  updatePlayerItemInDB,
  generateRankedParams,
} from '../utilities/riotUtilities';

export async function main(event, context, callback) {
  const { summonerName, summonerId } = event.pathParameters;

  const options = {
    url: NA + RANKED_POSITION_ENDPOINT + summonerId,
    method: 'GET',
    headers: {
      'X-Riot-Token': await getApiKey(),
    },
  };

  const rankedData = await requestHandler(options);

  const params = generateRankedParams(summonerName, rankedData);

  updatePlayerItemInDB(params);

  return callback(null, rankedData);
}
