import { RANKED_POSITION_ENDPOINT } from '../constants/riotConstants';
import {
  requestHandler,
  updatePlayerItemInDB,
  generateRankedParams,
  mapRegionToUrlEndpoint,
} from '../utilities/riotUtilities';
import { generate200Response, generateOptionsRequest } from '../utilities/httpUtilities';
import { lowerCaseRemoveSpacesDecode } from '../utilities/stringUtilities';

export const blank = 0;

export async function main(event, context, callback) {
  const { region, summonerName, summonerId } = event.pathParameters;
  const formattedSummonerName = lowerCaseRemoveSpacesDecode(summonerName);

  const url = mapRegionToUrlEndpoint(region) + RANKED_POSITION_ENDPOINT + summonerId;
  const options = await generateOptionsRequest(url);

  const rankedData = await requestHandler(options);
  if (rankedData.statusCode) {
    callback(null, rankedData);
    return;
  }

  const params = generateRankedParams(formattedSummonerName, rankedData, region);

  updatePlayerItemInDB(params);

  const response = generate200Response(rankedData);

  callback(null, response);
}
