import { PERMISSION_LEVELS } from '../config/constants';

// eslint-disable-next-line import/prefer-default-export
export const isSettingsEditionAllowedForUser = ({ memberships, memberId }) =>
  memberships?.find(
    ({ memberId: mId, permission }) =>
      mId === memberId && PERMISSION_LEVELS.ADMIN === permission,
  );
