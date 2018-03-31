import { NA, SUMMONER_NAME_ENDPOINT } from '../constants/riotConstants';
import {
  requestHandler,
  getPlayerFromDB,
  updatePlayerItemInDB,
  generateSummonerParams,
} from '../utilities/riotUtilities';
import { generate200Response, generateOptionsRequest } from '../utilities/httpUtilities';
import { lowerCaseRemoveSpacesDecode } from '../utilities/stringUtilities';

export const blank = 0;

export async function main(event, context, callback) {
  const { summonerName } = event.pathParameters;
  const formattedSummonerName = lowerCaseRemoveSpacesDecode(summonerName);

  const cacheSummonerData = await getPlayerFromDB(formattedSummonerName);
  if (cacheSummonerData) {
    const response = generate200Response(cacheSummonerData);
    callback(null, response);
    return;
  }

  const url = NA + SUMMONER_NAME_ENDPOINT + summonerName;
  const options = await generateOptionsRequest(url);

  const summonerData = await requestHandler(options);
  if (summonerData.statusCode) {
    callback(null, summonerData);
    return;
  }

  const params = generateSummonerParams(formattedSummonerName, summonerData);

  updatePlayerItemInDB(params);

  const response = generate200Response(summonerData);

  callback(null, response);
}
