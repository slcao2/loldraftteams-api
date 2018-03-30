import { NA, RANKED_POSITION_ENDPOINT } from '../constants/riotConstants';
import {
  requestHandler,
  updatePlayerItemInDB,
  generateRankedParams,
} from '../utilities/riotUtilities';
import { generate200Response, generateOptionsRequest } from '../utilities/httpUtilities';
import { lowerCaseRemoveSpacesDecode } from '../utilities/stringUtilities';

export const blank = 0;

export async function main(event, context, callback) {
  const { summonerName, summonerId } = event.pathParameters;
  const formattedSummonerName = lowerCaseRemoveSpacesDecode(summonerName);

  const url = NA + RANKED_POSITION_ENDPOINT + summonerId;
  const options = await generateOptionsRequest(url);

  const rankedData = await requestHandler(options);

  const params = generateRankedParams(formattedSummonerName, rankedData);

  updatePlayerItemInDB(params);

  const response = generate200Response(rankedData);

  callback(null, response);
}
