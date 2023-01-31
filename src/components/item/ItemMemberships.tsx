import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AvatarGroup from '@mui/material/AvatarGroup';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';

import { useContext } from 'react';

import { PermissionLevel } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import { ITEM_MEMBERSHIPS_CONTENT_ID } from '../../config/selectors';
import { membershipsWithoutUser } from '../../utils/membership';
import MemberAvatar from '../common/MemberAvatar';
import { CurrentUserContext } from '../context/CurrentUserContext';

type Props = {
  maxAvatar?: number;
  id?: string;
  onClick?: () => void;
};

const ItemMemberships = ({
  id,
  maxAvatar = 2,
  onClick,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: memberships, isError } = hooks.useItemMemberships(id);
  const { data: currentUser } = useContext(CurrentUserContext);

  if (!id) {
    return null;
  }

  if (!memberships || memberships.isEmpty() || isError) {
    return null;
  }

  const filteredMemberships = membershipsWithoutUser(
    memberships,
    currentUser?.id,
  );

  // display only if has more than 2 memberships
  if (!filteredMemberships?.size) {
    return null;
  }

  return (
    <Grid container alignItems="center" id={ITEM_MEMBERSHIPS_CONTENT_ID}>
      <Grid item>
        <Tooltip
          title={translateBuilder(BUILDER.SHARED_MEMBERS_TOOLTIP, {
            count: filteredMemberships.size,
          })}
          aria-label={translateBuilder(BUILDER.SHARED_MEMBERS_LABEL)}
        >
          <AvatarGroup max={maxAvatar} spacing={3} onClick={onClick}>
            {filteredMemberships.map(({ memberId, permission }) => {
              const badgeContent =
                permission === PermissionLevel.Read ? (
                  <VisibilityIcon fontSize="small" />
                ) : (
                  <EditIcon fontSize="small" />
                );

              return (
                <Badge
                  key={memberId}
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  badgeContent={badgeContent}
                  sx={{ border: 'none' }}
                >
                  <MemberAvatar id={memberId} />
                </Badge>
              );
            })}
          </AvatarGroup>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default ItemMemberships;
