import { v4 } from 'uuid';

import { PERMISSION_LEVELS } from '../enums';
import { Invitation } from '../config/types'

// eslint-disable-next-line import/prefer-default-export
export const buildInvitation = ({ email, permission }: { email?: string, permission?: string } = {}): Invitation => ({
  // set temporary id for react-key
  id: v4(),
  email: email ?? '',
  permission: permission ?? PERMISSION_LEVELS.READ,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
