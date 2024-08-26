import { Edit, Visibility } from '@mui/icons-material';
import { AvatarGroup, Badge, Grid, Tooltip } from '@mui/material';

import { PermissionLevel } from '@graasp/sdk';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import { ITEM_MEMBERSHIPS_CONTENT_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { membershipsWithoutUser } from '../../utils/membership';
import MemberAvatar from '../common/MemberAvatar';

type Props = {
  id?: string;
  maxAvatar?: number;
};

const ItemMemberships = ({ id, maxAvatar = 2 }: Props): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: memberships, isError } = hooks.useItemMemberships(id);
  const { data: currentUser } = hooks.useCurrentMember();

  if (!id) {
    return null;
  }

  if (!memberships || !memberships.length || isError) {
    return null;
  }

  const filteredMemberships = membershipsWithoutUser(
    memberships,
    currentUser?.id,
  );

  // display only if has more than 2 memberships
  if (!filteredMemberships?.length) {
    return null;
  }

  return (
    <Grid container alignItems="center" id={ITEM_MEMBERSHIPS_CONTENT_ID}>
      <Grid item>
        <Tooltip
          title={translateBuilder(BUILDER.SHARED_MEMBERS_TOOLTIP, {
            count: filteredMemberships.length,
          })}
          aria-label={translateBuilder(BUILDER.SHARED_MEMBERS_LABEL)}
        >
          <AvatarGroup max={maxAvatar} spacing={3}>
            {filteredMemberships.map(({ account, permission }) => {
              const badgeContent =
                permission === PermissionLevel.Read ? (
                  <Visibility fontSize="small" />
                ) : (
                  <Edit fontSize="small" />
                );

              return (
                <Badge
                  key={account.id}
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  badgeContent={badgeContent}
                  sx={{ border: 'none' }}
                >
                  <MemberAvatar id={account.id} />
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
