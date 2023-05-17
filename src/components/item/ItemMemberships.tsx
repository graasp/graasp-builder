import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AvatarGroup from '@mui/material/AvatarGroup';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';

import { PermissionLevel } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import { ITEM_MEMBERSHIPS_CONTENT_ID } from '../../config/selectors';
import { membershipsWithoutUser } from '../../utils/membership';
import MemberAvatar from '../common/MemberAvatar';
import { useCurrentUserContext } from '../context/CurrentUserContext';

type Props = {
  id?: string;
  onClick: () => void;
  maxAvatar?: number;
};

const ItemMemberships = ({
  id,
  maxAvatar = 2,
  onClick,
}: Props): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: memberships, isError } = hooks.useItemMemberships(id);
  const { data: currentUser } = useCurrentUserContext();

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
            {filteredMemberships.map(({ member, permission }) => {
              const badgeContent =
                permission === PermissionLevel.Read ? (
                  <VisibilityIcon fontSize="small" />
                ) : (
                  <EditIcon fontSize="small" />
                );

              return (
                <Badge
                  key={member.id}
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  badgeContent={badgeContent}
                  sx={{ border: 'none' }}
                >
                  <MemberAvatar id={member.id} />
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
