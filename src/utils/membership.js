import { PERMISSIONS_EDITION_ALLOWED } from '../config/constants';
import { PERMISSION_LEVELS } from '../config/enum';

export const isSettingsEditionAllowedForUser = ({ memberships, memberId }) =>
  memberships?.find(
    ({ memberId: mId, permission }) =>
      mId === memberId && PERMISSION_LEVELS.ADMIN === permission,
  );

export const isItemUpdateAllowedForUser = ({ memberships, memberId }) =>
  memberships?.find(
    ({ memberId: mId, permission }) =>
      mId === memberId && PERMISSIONS_EDITION_ALLOWED.includes(permission),
  );
