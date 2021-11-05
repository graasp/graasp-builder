import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { hooks } from '../../config/queryClient';
import MemberAvatar from '../common/MemberAvatar';
import { PERMISSION_LEVELS } from '../../enums';
import { ITEM_MEMBERSHIPS_CONTENT_ID } from '../../config/selectors';
import { getMembership, membershipsWithoutUser } from '../../utils/membership';
import { CurrentUserContext } from '../context/CurrentUserContext';

const useStyles = makeStyles({
  badge: {
    border: 'none',
  },
});

const ItemMemberships = ({ id, maxAvatar, onClick }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { data: memberships, isError } = hooks.useItemMemberships([id]);
  const { data: currentUser } = useContext(CurrentUserContext);

  if (!id) {
    return null;
  }

  if (!memberships || memberships.isEmpty() || isError) {
    return null;
  }

  const filteredMemberships = membershipsWithoutUser(
    getMembership(memberships),
    currentUser?.get('id'),
  );

  // display only if has more than 2 memberships
  if (!filteredMemberships?.length) {
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
                  className={classes.badge}
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
