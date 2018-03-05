import AWS from 'aws-sdk/global';
import S3 from 'aws-sdk/clients/s3';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import request from 'request';
import {
  API_KEY_S3_BUCKET,
  API_KEY_S3_FILENAME,
  TABLE_NAME,
} from '../constants/awsConstants';
import {
  RATE_LIMIT_EXCEEDED,
  FORBIDDEN, NOT_FOUND,
  BAD_REQUEST,
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
} from '../constants/riotConstants';

export const requestHandler = options => new Promise((resolve, reject) => {
  request(options, (error, response, body) => {
    if (response.statusCode === RATE_LIMIT_EXCEEDED) {
      reject(new Error('Rate limit exceeded. Please try again in 2 minutes'));
    } else if (response.statusCode === FORBIDDEN) {
      reject(new Error('API key expired. Generate new api key.'));
    } else if (response.statusCode === NOT_FOUND || response.statusCode === BAD_REQUEST) {
      resolve(undefined);
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

export const getPlayerFromDB = (summonerName) => {
  const dynamoDB = new DynamoDB.DocumentClient();

  const params = {
    TableName: TABLE_NAME,
    Key: {
      name: summonerName,
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

export const generateSummonerParams = (summonerData) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      name: summonerData.name,
    },
    ExpressionAttributeNames: {
      '#id': 'id',
      '#accountId': 'accountId',
      '#profileIconId': 'profileIconId',
      '#revisionDate': 'revisionDate',
      '#summonerLevel': 'summonerLevel',
    },
    ExpressionAttributeValues: {
      ':id': summonerData.id,
      ':accountId': summonerData.accountId,
      ':profileIconId': summonerData.profileIconId,
      ':revisionDate': summonerData.revisionDate,
      ':summonerLevel': summonerData.summonerLevel,
    },
    UpdateExpression: 'SET #id = :id, #accountId = :accountId, #profileIconId = :profileIconId, #revisionDate = :revisionDate, #summonerLevel = :summonerLevel',
  };
  return params;
};

export const generateRankedParams = (summonerName, rankedData) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      name: summonerName,
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

export const generateMatchListParams = (summonerName, matchList, matchListType) => {
  const matchListExpressionName = `#${matchListType}`;
  const matchListExpressionValue = `:${matchListType}`;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      name: summonerName,
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
}

export const generateMatchParams = (summonerName, matchData, matchType) => {
  const matchExpressionName = `#${matchType}`;
  const matchExpressionValue = `:${matchType}`;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      name: summonerName,
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
