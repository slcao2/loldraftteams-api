import { NA, RANKED_POSITION_ENDPOINT } from '../constants/riotConstants';
import {
  getApiKey,
  requestHandler,
  updatePlayerItemInDB,
  generateRankedParams,
} from '../utilities/riotUtilities';

export async function main(event, context, callback) {
  const data = event.body;

  const options = {
    url: NA + RANKED_POSITION_ENDPOINT + data.summonerId,
    method: 'GET',
    headers: {
      'X-Riot-Token': await getApiKey(),
    },
  };

  const rankedData = await requestHandler(options);

  const params = generateRankedParams(data.summonerName, rankedData);

  updatePlayerItemInDB(params);

  return callback(null, rankedData);
}
