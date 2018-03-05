import { NA, SUMMONER_NAME_ENDPOINT } from '../constants/riotConstants';
import {
  getApiKey,
  requestHandler,
  getPlayerFromDB,
  updatePlayerItemInDB,
  generateSummonerParams,
} from '../utilities/riotUtilities';

export async function main(event, context, callback) {
  const { summonerName } = event.pathParameters;

  const temp = await getPlayerFromDB(summonerName);
  if (temp) {
    return callback(null, temp);
  }

  const options = {
    url: NA + SUMMONER_NAME_ENDPOINT + summonerName,
    method: 'GET',
    headers: {
      'X-Riot-Token': await getApiKey(),
    },
  };

  const summonerData = await requestHandler(options);

  const params = generateSummonerParams(summonerData);

  updatePlayerItemInDB(params);

  return callback(null, summonerData);
}
