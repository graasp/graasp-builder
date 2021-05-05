import {
  PERMISSIONS_EDITION_ALLOWED,
  PERMISSION_LEVELS,
} from '../config/constants';

export const isSettingsEditionAllowedForUser = ({ memberships, memberId }) =>
  memberships?.find(
    ({ memberId: mId, permission }) =>
      mId === memberId && PERMISSION_LEVELS.ADMIN === permission,
  );

export const isItemEditionAllowedForUser = ({ memberships, memberId }) =>
  memberships?.find(
    ({ memberId: mId, permission }) =>
      mId === memberId && PERMISSIONS_EDITION_ALLOWED.includes(permission),
  );
