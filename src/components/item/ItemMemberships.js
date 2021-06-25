import React from 'react';
import { Loader } from '@graasp/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { hooks } from '../../config/queryClient';
import MemberAvatar from '../common/MemberAvatar';
import { PERMISSION_LEVELS } from '../../enums';
import { ITEM_MEMBERSHIPS_CONTENT_ID } from '../../config/selectors';
import { membershipsWithoutUser } from '../../utils/membership';

const ItemMemberships = ({ id, maxAvatar, onClick }) => {
  // eslint-disable-next-line no-console
  console.log('id: ', id);
  const { t } = useTranslation();
  const { data: memberships, isLoading, isError } = hooks.useItemMemberships(
    id,
  );
  const {
    data: currentUser,
    isLoading: isLoadingCurrentMember,
  } = hooks.useCurrentMember();

  if (!id) {
    return null;
  }

  if (isLoading || isLoadingCurrentMember) {
    return <Loader />;
  }

  if (!memberships || memberships.isEmpty() || isError) {
    return null;
  }

  const filteredMemberships = membershipsWithoutUser(
    memberships,
    currentUser?.get('id'),
  );

  // display only if has more than 2 memberships
  if (filteredMemberships.isEmpty()) {
    return null;
  }

  return (
    <Grid
      container
      alignItems="center"
      justify="space-between"
      id={ITEM_MEMBERSHIPS_CONTENT_ID}
    >
      <Grid item>
        <Typography variant="body2">{t('Currently shared with')}</Typography>
      </Grid>
      <Grid item>
        <Tooltip
          title={t(
            `This item is shared with ${filteredMemberships.size} users`,
          )}
          aria-label="shared users"
        >
          <AvatarGroup max={maxAvatar} spacing={3} onClick={onClick}>
            {filteredMemberships.map(({ memberId, permission }) => {
              const badgeContent =
                permission === PERMISSION_LEVELS.READ ? (
                  <VisibilityIcon fontSize="small" />
                ) : (
                  <EditIcon fontSize="small" />
                );

              return (
                <Badge
                  key={memberId}
                  overlap="circle"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  badgeContent={badgeContent}
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

ItemMemberships.propTypes = {
  maxAvatar: PropTypes.number,
  id: PropTypes.string,
  onClick: PropTypes.func,
};

ItemMemberships.defaultProps = {
  maxAvatar: 2,
  id: null,
  onClick: null,
};

export default ItemMemberships;
