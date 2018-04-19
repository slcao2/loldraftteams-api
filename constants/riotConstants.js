// Regional Endpoints
export const BR = 'https://br1.api.riotgames.com';
export const EUNE = 'https://eun1.api.riotgames.com';
export const EUW = 'https://euw1.api.riotgames.com';
export const JP = 'https://jp1.api.riotgames.com';
export const KR = 'https://kr.api.riotgames.com';
export const LAN = 'https://la1.api.riotgames.com';
export const LAS = 'https://la2.api.riotgames.com';
export const NA = 'https://na1.api.riotgames.com';
export const OCE = 'https://oc1.api.riotgames.com';
export const TR = 'https://tr1.api.riotgames.com';
export const RU = 'https://ru.api.riotgames.com';
export const PBE = 'https://pbe1.api.riotgames.com';

// API Endpoints
export const SUMMONER_NAME_ENDPOINT = '/lol/summoner/v3/summoners/by-name/';
export const RANKED_POSITION_ENDPOINT = '/lol/league/v3/positions/by-summoner/';
export const MATCH_LIST_ENDPOINT = '/lol/match/v3/matchlists/by-account/';
export const MATCH_ENDPOINT = '/lol/match/v3/matches/';
export const CHAMPION_MASTERY_ENDPOINT = '/lol/champion-mastery/v3/champion-masteries/by-summoner/';
export const STATIC_CHAMPION_ENDPOINT = '/lol/static-data/v3/champions/';

// Response Codes
export const BAD_REQUEST = 400;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const RATE_LIMIT_EXCEEDED = 429;
export const OK = 200;

// Matchmaking Queues
export const SR_DRAFT_ID = '400';
export const RANKED_SOLO_ID = '420';
export const SR_BLIND_ID = '430';
export const RANKED_FLEX_ID = '440';

// Match List Types
export const SOLO_MATCH_LIST = 'soloMatchList';
export const FLEX_MATCH_LIST = 'flexMatchList';
export const DRAFT_MATCH_LIST = 'draftMatchList';
export const BLIND_MATCH_LIST = 'blindMatchList';

// Match Types
export const SOLO_MATCH = 'soloMatch';
export const FLEX_MATCH = 'flexMatch';
export const DRAFT_MATCH = 'draftMatch';
export const BLIND_MATCH = 'blindMatch';
