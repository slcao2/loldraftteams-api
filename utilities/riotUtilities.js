import AWS from 'aws-sdk/global';
import S3 from 'aws-sdk/clients/s3';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import request from 'request';
import {
  API_KEY_S3_BUCKET,
  API_KEY_S3_FILENAME,
  TABLE_NAME,
  EXPIRARY_TIME,
} from '../constants/awsConstants';
import {
  OK,
  SR_DRAFT_ID,
  RANKED_SOLO_ID,
  SR_BLIND_ID,
  RANKED_FLEX_ID,
  SOLO_MATCH_LIST,
  FLEX_MATCH_LIST,
  DRAFT_MATCH_LIST,
  BLIND_MATCH_LIST,
  SOLO_MATCH,
  FLEX_MATCH,
  DRAFT_MATCH,
  BLIND_MATCH,
  NA,
  BR,
  EUNE,
  EUW,
  JP,
  KR,
  LAN,
  LAS,
  TR,
  OCE,
  RU,
  PBE,
} from '../constants/riotConstants';
import { generateNon200Response } from './httpUtilities';

export const requestHandler = options => new Promise((resolve, reject) => {
  request(options, (error, response, body) => {
    if (response.statusCode !== OK) {
      resolve(generateNon200Response(response, options));
      return;
    }
    resolve(JSON.parse(body));
  });
});

export const getApiKey = () => {
  const s3 = new S3();

  const params = {
    Bucket: API_KEY_S3_BUCKET,
    Key: API_KEY_S3_FILENAME,
  };

  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(data.Body.toString('utf-8'));
      }
    });
  });
};

export const getPlayerFromDB = (summonerName, region) => {
  const dynamoDB = new DynamoDB.DocumentClient();

  const params = {
    TableName: TABLE_NAME,
    Key: {
      keyName: summonerName,
      region,
    },
  };

  return new Promise((resolve, reject) => {
    dynamoDB.get(params, (err, data) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(data.Item);
      }
    });
  });
};

export const updatePlayerItemInDB = (params) => {
  const dynamoDB = new DynamoDB.DocumentClient();

  return new Promise((resolve, reject) => {
    dynamoDB.update(params, (err, data) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(data.Item);
      }
    });
  });
};

export const generateSummonerParams = (summonerName, summonerData, region) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      keyName: summonerName,
      region,
    },
    ExpressionAttributeNames: {
      '#id': 'id',
      '#accountId': 'accountId',
      '#profileIconId': 'profileIconId',
      '#revisionDate': 'revisionDate',
      '#summonerLevel': 'summonerLevel',
      '#expirationDate': 'expirationDate',
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':id': summonerData.id,
      ':accountId': summonerData.accountId,
      ':profileIconId': summonerData.profileIconId,
      ':revisionDate': summonerData.revisionDate,
      ':summonerLevel': summonerData.summonerLevel,
      ':expirationDate': Math.floor(Date.now() / 1000) + EXPIRARY_TIME,
      ':name': summonerData.name,
    },
    UpdateExpression: `SET #id = :id, #accountId = :accountId, #profileIconId = :profileIconId, #revisionDate = :revisionDate, 
                           #summonerLevel = :summonerLevel, #expirationDate = :expirationDate, #name = :name`,
  };
  return params;
};

export const generateRankedParams = (summonerName, rankedData, region) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      keyName: summonerName,
      region,
    },
    ExpressionAttributeNames: {
      '#league': 'league',
    },
    ExpressionAttributeValues: {
      ':league': rankedData,
    },
    UpdateExpression: 'SET #league = :league',
  };
  return params;
};

export const generateMatchListParams = (summonerName, matchList, matchListType, region) => {
  const matchListExpressionName = `#${matchListType}`;
  const matchListExpressionValue = `:${matchListType}`;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      keyName: summonerName,
      region,
    },
    ExpressionAttributeNames: {
      [matchListExpressionName]: matchListType,
    },
    ExpressionAttributeValues: {
      [matchListExpressionValue]: matchList,
    },
    UpdateExpression: `SET ${matchListExpressionName} = ${matchListExpressionValue}`,
  };
  return params;
};

export const generateMatchParams = (summonerName, matchData, matchType, region) => {
  const matchExpressionName = `#${matchType}`;
  const matchExpressionValue = `:${matchType}`;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      keyName: summonerName,
      region,
    },
    ExpressionAttributeNames: {
      [matchExpressionName]: matchType,
    },
    ExpressionAttributeValues: {
      [matchExpressionValue]: matchData,
    },
    UpdateExpression: `SET ${matchExpressionName} = ${matchExpressionValue}`,
  };
  return params;
};

export const generateMasteryParams = (summonerName, masteryData, region) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      keyName: summonerName,
      region,
    },
    ExpressionAttributeNames: {
      '#mastery': 'mastery',
    },
    ExpressionAttributeValues: {
      ':mastery': masteryData,
    },
    UpdateExpression: 'SET #mastery = :mastery',
  };
  return params;
};

export const mapQueueIdToMatchListType = (queueId) => {
  switch (queueId) {
    case SR_DRAFT_ID:
      return DRAFT_MATCH_LIST;
    case RANKED_SOLO_ID:
      return SOLO_MATCH_LIST;
    case SR_BLIND_ID:
      return BLIND_MATCH_LIST;
    case RANKED_FLEX_ID:
      return FLEX_MATCH_LIST;
    default:
  }
};

export const mapQueueIdToMatchType = (queueId) => {
  switch (queueId) {
    case SR_DRAFT_ID:
      return DRAFT_MATCH;
    case RANKED_SOLO_ID:
      return SOLO_MATCH;
    case SR_BLIND_ID:
      return BLIND_MATCH;
    case RANKED_FLEX_ID:
      return FLEX_MATCH;
    default:
  }
};

export const mapRegionToUrlEndpoint = (region) => {
  switch (region) {
    case 'BR':
      return BR;
    case 'EUNE':
      return EUNE;
    case 'EUW':
      return EUW;
    case 'JP':
      return JP;
    case 'KR':
      return KR;
    case 'LAN':
      return LAN;
    case 'LAS':
      return LAS;
    case 'NA':
      return NA;
    case 'OCE':
      return OCE;
    case 'TR':
      return TR;
    case 'RU':
      return RU;
    case 'PBE':
      return PBE;
    default:
      return '';
  }
};
