import { CHAMPION_MASTERY_ENDPOINT } from '../constants/riotConstants';
import {
  requestHandler,
  updatePlayerItemInDB,
  generateMasteryParams,
  mapRegionToUrlEndpoint,
} from '../utilities/riotUtilities';
import { generate200Response, generateOptionsRequest } from '../utilities/httpUtilities';
import { lowerCaseRemoveSpacesDecode } from '../utilities/stringUtilities';

export const blank = 0;

export async function main(event, context, callback) {
  const { region, summonerName, summonerId } = event.pathParameters;
  const formattedSummonerName = lowerCaseRemoveSpacesDecode(summonerName);

  const url = mapRegionToUrlEndpoint(region) + CHAMPION_MASTERY_ENDPOINT + summonerId;
  const options = await generateOptionsRequest(url);

  const masteryData = await requestHandler(options);
  if (masteryData.statusCode) {
    callback(null, masteryData);
    return;
  }

  const params = generateMasteryParams(formattedSummonerName, masteryData, region);

  updatePlayerItemInDB(params);

  const response = generate200Response(masteryData);

  callback(null, response);
}
