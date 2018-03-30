import _ from 'lodash';

export const lowerCaseRemoveSpacesDecode = string => _.replace(_.toLower(_.trim(decodeURIComponent(string))), ' ', '');