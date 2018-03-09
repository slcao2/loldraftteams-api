import { NA, SUMMONER_NAME_ENDPOINT } from '../constants/riotConstants';
import {
  requestHandler,
  getPlayerFromDB,
  updatePlayerItemInDB,
  generateSummonerParams,
} from '../utilities/riotUtilities';
import { generate200Response, generateOptionsRequest } from '../utilities/httpUtilities';

export const blank = 0;

export async function main(event, context, callback) {
  const { summonerName } = event.pathParameters;

  const cacheSummonerData = await getPlayerFromDB(summonerName);
  if (cacheSummonerData) {
    const response = generate200Response(cacheSummonerData);
    callback(null, response);
    return;
    return;
  }

  const url = NA + SUMMONER_NAME_ENDPOINT + summonerName;
  const options = generateOptionsRequest(url);

  const summonerData = await requestHandler(options);

  const params = generateSummonerParams(summonerData);

  updatePlayerItemInDB(params);

  const response = generate200Response(summonerData);

  callback(null, response);
}
